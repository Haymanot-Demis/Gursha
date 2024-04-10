import { Request, Response } from "express";
import { BASE_URL } from "../config/config";
import { CustomResponse } from "../config/response";
import User from "../models/user/model";
import { generatePIN } from "../utils/otpGenerator";
import {
	AccountNotVerifiedError,
	ResourceNotFoundError,
	unauthunticatedError,
} from "../utils/error";
import { sendSMS } from "../services/twilio.sms.service";
import userRepository from "../repositories/user.repository";
import VerificationCode from "../models/verificationCode/model";
import verificationCodeRepository from "../repositories/verificationCode.repository";
import { bcryptHash, bcryptCompare, generateJWTToken } from "../utils/auth";
import { catchAsync } from "../utils/asyncHandler";
import { generateSecretKey } from "../utils/crypto";

export default class AuthController {
	// opening mobile banking account
	create = catchAsync(async (req: Request, res: Response) => {
		const { accountNumber } = req.body;

		// get the user info from the core banking service by the account number
		const response = await fetch(`${BASE_URL}?accountNumber=${accountNumber}`);
		const data = await response.json();

		if (!data?.length) {
			throw new ResourceNotFoundError("Account number not found");
		}

		const user = new User();
		user.accountNumber = accountNumber;
		const pin = generatePIN();
		user.passwordHash = await bcryptHash(pin);

		await userRepository.save(user);

		console.log(user);

		// sms the pin to the owner

		sendSMS(data[0].phoneNumber, `Your mobile banking pin is ${pin}`);

		res
			.status(201)
			.json(
				new CustomResponse(true, "Mobile banking account created successfully")
			);
	});

	getActivationCode = catchAsync(async (req: Request, res: Response) => {
		// TODO: when the user requests for the activation code, we should check if the user is already activated, and either we should send a new code or a message that the user is already activated
		const { accountNumber } = req.body;

		const user = await userRepository.findOne({ where: { accountNumber } });

		if (!user) {
			throw new ResourceNotFoundError(
				`User with account number ${accountNumber} not found`
			);
		}

		const prevCode = await verificationCodeRepository.findOne({
			where: { user: { accountNumber } },
		});

		if (prevCode) {
			await verificationCodeRepository.remove(prevCode);
		}

		const resonse = await fetch(`${BASE_URL}?accountNumber=${accountNumber}`);
		const data = await resonse.json();

		if (!data?.length) {
			throw new ResourceNotFoundError(
				`Account with account number ${accountNumber}not found`
			);
		}

		const verificationCode = new VerificationCode();
		const code = generatePIN();
		verificationCode.code = await bcryptHash(code);
		verificationCode.expirationDate = new Date(Date.now() + 1000 * 60 * 5);
		verificationCode.user = user;

		await verificationCodeRepository.save(verificationCode);

		sendSMS(
			data[0].phoneNumber,
			`Your activation code is ${code}, it will expire in 5 minutes`
		);

		res
			.status(200)
			.json(new CustomResponse(true, "Activation code sent successfully"));
	});

	activate = catchAsync(async (req: Request, res: Response) => {
		const { accountNumber, code, deviceCode, publicKey } = req.body;

		const verificationCode = await verificationCodeRepository.findOne({
			where: {
				user: { accountNumber },
			},
		});

		console.log(verificationCode);

		if (!verificationCode) {
			throw new ResourceNotFoundError("Code not found");
		}

		const isValid =
			verificationCode?.expirationDate > new Date() ||
			(await bcryptCompare(code, verificationCode.code));

		if (!isValid) {
			await verificationCodeRepository.remove(verificationCode);
			throw new unauthunticatedError("Invalid or expired code");
		}

		await verificationCodeRepository.remove(verificationCode);

		// activate the account
		const user = await userRepository.findOne({ where: { accountNumber } });
		user.isAccountActive = true;
		user.deviceCodeHash = await bcryptHash(deviceCode);
		user.secretKey = generateSecretKey();

		await userRepository.save(user);

		res
			.status(200)
			.json(
				new CustomResponse(
					true,
					"Account activated successfully, you can now login"
				)
			);
	});

	login = catchAsync(async (req: Request, res: Response) => {
		// TODO: when the use tries to login, we should check if the user is already loggedin on other device, if so, we should block
		const { accountNumber, pin, deviceCode } = req.body;

		const user = await userRepository.findOne({ where: { accountNumber } });

		if (!user) {
			throw new ResourceNotFoundError("User not found");
		}

		if (!user.isAccountActive) {
			throw new AccountNotVerifiedError("Account not activated");
		}

		if (user.failedLoginAttempts > 3 || user.isAccountLocked) {
			throw new unauthunticatedError(
				"Account locked, due to multiple failed login attempts"
			);
		}

		const isValidDevice = await bcryptCompare(deviceCode, user.deviceCodeHash);

		if (!isValidDevice) {
			throw new unauthunticatedError("Login attempt from an unknown device");
		}

		const isMatch = await bcryptCompare(pin, user.passwordHash);

		if (!isMatch) {
			user.failedLoginAttempts += 1;
			user.isAccountLocked = user.failedLoginAttempts >= 3;
			await userRepository.save(user);
			throw new unauthunticatedError("Invalid credentials");
		}

		const token = generateJWTToken(user);

		res
			.status(200)
			.json(new CustomResponse(true, "Login successful", { token }));
	});

	unlock = catchAsync(async (req: Request, res: Response) => {
		const { accountNumber } = req.body;

		const user = await userRepository.findOne({ where: { accountNumber } });

		if (!user) {
			throw new ResourceNotFoundError("User not found");
		}

		user.failedLoginAttempts = 0;
		user.isAccountLocked = false;

		await userRepository.save(user);

		res
			.status(200)
			.json(new CustomResponse(true, "Account unlocked successfully"));
	});

	changePIn = catchAsync(async (req: Request, res: Response) => {
		const { accountNumber, oldPin, newPin } = req.body;

		const user = await userRepository.findOne({ where: { accountNumber } });

		if (!user) {
			throw new ResourceNotFoundError("User not found");
		}

		const isValid = await bcryptCompare(oldPin, user.passwordHash);

		if (!isValid) {
			throw new unauthunticatedError("Invalid credentials");
		}

		user.passwordHash = await bcryptHash(newPin);

		await userRepository.save(user);

		res.status(200).json(new CustomResponse(true, "Pin changed successfully"));
	});
}
