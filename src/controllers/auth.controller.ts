import { Request, Response, NextFunction } from "./../config/extended.express";
import { CustomResponse } from "../config/response";
import User from "../models/user/model";
import { generateOTP, generateToken } from "../utils/otpGenerator";
import {
	AccountNotVerifiedError,
	BadRequest,
	ResourceAlreadyExistsError,
	ResourceNotFoundError,
	SMSSendingError,
	unauthunticatedError,
	UnknownError,
} from "../utils/error";
import userRepository from "../repositories/user.repository";
import {
	bcryptHash,
	bcryptCompare,
	generateJWTToken,
	verifyJWTToken,
} from "../utils/auth";
import { catchAsync } from "../utils/asyncHandler";
import {
	sendPasswordResetEmail,
	sendVerificationEmail,
} from "../services/email.service";
import Token from "../models/verificationCode/model";
import { TokenTypes } from "../config/constants";
import tokenRepository from "../repositories/token.repository";
import { sendSMS, sendSMSApi } from "../services/twilio.sms.service";
import {
	resetPasswordExpirationSeconds,
	SMS_API,
	verifyEmailOrPhoneNumberExpirationSeconds,
} from "../config/config";

export default class AuthController {
	register = catchAsync(async (req: Request, res: Response) => {
		const { fullname, email, password, phoneNumber, isMobile } = req.body;

		const userExist = await userRepository.findOne({
			where: [{ email }, { phoneNumber }],
		});

		if (userExist) {
			throw new ResourceAlreadyExistsError(
				"Email or phone number  already exist"
			);
		}

		const user = new User();
		user.fullname = fullname;
		user.email = email;
		user.passwordHash = await bcryptHash(password);
		user.phoneNumber = phoneNumber;

		await userRepository.save(user);

		console.log(user);
		const token = generateToken(
			user,
			TokenTypes.VERIFY_EMAIL_TOKEN,
			verifyEmailOrPhoneNumberExpirationSeconds
		);

		console.log("token", token);

		await tokenRepository.save(token);
		let message = "";
		if (email) {
			// send verification email
			await sendVerificationEmail(user, token);
			message =
				"Registration successful, check your email for verification token";
		} else if (phoneNumber) {
			const OTP = generateToken(
				user,
				TokenTypes.VERIFY_EMAIL_TOKEN,
				verifyEmailOrPhoneNumberExpirationSeconds
			);

			try {
				const result = await sendSMSApi(phoneNumber, OTP.token);
				console.log("result", result);
				const data = await result.json();
				if (!result.status?.toString().startsWith("2")) {
					throw new SMSSendingError(data.message);
				}
				console.log("data", data);
				await tokenRepository.save(OTP);
			} catch (error) {
				console.log("error", error);
				throw new SMSSendingError(error.message);
			}
			// await sendSMS(user.phoneNumber, token.token);
			message =
				"Registration successful, we sent you a verification token to your mobile number";
		}

		user.passwordHash = undefined;

		res.status(201).json(new CustomResponse(true, message, user));
	});

	login = catchAsync(async (req: Request, res: Response) => {
		const { email, phoneNumber, password } = req.body;

		const user = await userRepository.findOne({
			where: [{ email }, { phoneNumber }],
		});

		if (!user) {
			throw new ResourceNotFoundError("Invalid credentials");
		}

		if (!user.isEmailVerified) {
			const verificationToken = generateToken(
				user,
				TokenTypes.VERIFY_EMAIL_TOKEN,
				verifyEmailOrPhoneNumberExpirationSeconds
			);
			// resend verification email
			let message = "";
			if (email) {
				await sendVerificationEmail(user, verificationToken);
				message = "Email is not verified, please check your email";
			} else if (phoneNumber) {
				// const smsResponse = sendSMS(user.phoneNumber, verificationToken.token);
				// console.log("message", smsResponse);
				const result = await sendSMSApi(phoneNumber, verificationToken.token);
				console.log("result", result);
				const data = await result.json();
				if (!result.status?.toString().startsWith("2")) {
					throw new SMSSendingError(data.message);
				}
				message = "Email is not verified, please check your phone for OTP";
			}

			await tokenRepository.save(verificationToken);

			throw new AccountNotVerifiedError(message);
		}

		// if (!user.isAccountActive) {
		// 	throw new AccountNotVerifiedError("Account not activated");
		// }

		if (user.failedLoginAttempts > 3 || user.isAccountLocked) {
			throw new unauthunticatedError(
				"Account locked, due to multiple failed login attempts"
			);
		}

		const isMatch = await bcryptCompare(password, user.passwordHash);

		if (!isMatch) {
			user.failedLoginAttempts += 1;
			user.isAccountLocked = user.failedLoginAttempts >= 3;
			await userRepository.save(user);
			throw new unauthunticatedError("Invalid credentials");
		}

		const token = generateJWTToken(user);

		const refreshToken = new Token();
		refreshToken.token = token.refreshToken;
		refreshToken.user = user;
		refreshToken.expirationDate = new Date(
			Date.now() + 7 * 24 * 60 * 60 * 1000
		); // 7 days
		refreshToken.type = TokenTypes.REFRESH_TOKEN;

		// todo: we have to remove the previous refresh token
		const oldRefreshToken = await tokenRepository.findOne({
			where: { user: { id: user.id }, type: TokenTypes.REFRESH_TOKEN },
		});

		// if (oldRefreshToken) {
		// 	await tokenRepository.remove(oldRefreshToken);
		// }

		await tokenRepository.save(refreshToken);
		user.passwordHash = undefined;

		res
			.status(200)
			.json(new CustomResponse(true, "Login successful", { ...token, user }));
	});

	refreshToken = catchAsync(async (req: Request, res: Response) => {
		const { refreshToken } = req.body;

		const refreshTokenExist = await tokenRepository.findOne({
			where: { token: refreshToken },
			relations: ["user"],
		});

		if (!refreshTokenExist) {
			return res.status(404).json({ message: "Invalid refresh token" });
		}

		verifyJWTToken(refreshTokenExist.token);

		const token = generateJWTToken(refreshTokenExist.user);

		const newRefreshToken = new Token();
		newRefreshToken.token = token.refreshToken;
		newRefreshToken.user = refreshTokenExist.user;
		newRefreshToken.expirationDate = new Date(
			Date.now() + 7 * 24 * 60 * 60 * 1000
		); // 7 days
		newRefreshToken.type = TokenTypes.REFRESH_TOKEN;

		await tokenRepository.save(newRefreshToken);
		await tokenRepository.remove(refreshTokenExist);
		refreshTokenExist.user.passwordHash = undefined;

		return res.status(200).json({
			...token,
			user: refreshTokenExist.user,
			message: "Refresh token created",
		});
	});

	verifyEmailOrPhoneNumber = catchAsync(async (req: Request, res: Response) => {
		const { email, phoneNumber, token } = req.query;
		console.log("query", req.query);

		const user = await userRepository.findOne({
			where: [
				{ email: email as string },
				{ phoneNumber: phoneNumber as string },
			],
		});

		if (!user) {
			throw new ResourceNotFoundError("User not found");
		}

		if (user.isEmailVerified) {
			throw new BadRequest("Email already verified");
		}

		const verificationToken = await tokenRepository.findOne({
			where: {
				token: token as string,
				user: { id: user.id },
				type: TokenTypes.VERIFY_EMAIL_TOKEN,
			},
		});

		if (!verificationToken) {
			throw new ResourceNotFoundError("Token not found");
		}

		if (verificationToken.expirationDate < new Date()) {
			const newToken = generateToken(
				user,
				TokenTypes.VERIFY_EMAIL_TOKEN,
				verifyEmailOrPhoneNumberExpirationSeconds
			);
			let message = "";
			if (email) {
				await sendVerificationEmail(user, newToken);
				message =
					"Email verification token expired, check your email for new token";
			} else if (phoneNumber) {
				const result = await sendSMSApi(phoneNumber as string, newToken.token);
				console.log("result", result);
				const data = await result.json();
				if (!result.status?.toString().startsWith("2")) {
					throw new SMSSendingError(data.message);
				}
				// const smsResponse = await sendSMS(user.phoneNumber, newToken.token);
				// console.log("message", smsResponse);
				message =
					"Phone number verification OPT expired, check your phone for new one";
			}
			throw new BadRequest(message);
		}

		// await tokenRepository.remove(verificationToken);

		user.isEmailVerified = true;

		await userRepository.save(user);

		res.status(200).json(new CustomResponse(true, "Verification successful"));
	});

	forgotPassword = catchAsync(async (req: Request, res: Response) => {
		const { email, phoneNumber } = req.query;

		const user = await userRepository.findOne({
			where: [
				{ email: email as string },
				{ phoneNumber: phoneNumber as string },
			],
		});

		if (!user) {
			throw new ResourceNotFoundError("User not found");
		}

		if (!user.isEmailVerified) {
			const verificationToken = generateToken(
				user,
				TokenTypes.RESET_PASSWORD_TOKEN,
				resetPasswordExpirationSeconds
			);
			let message = "";
			if (email) {
				await sendVerificationEmail(user, verificationToken);
				message =
					"Email is not verified, please check your email for verification token";
			} else if (phoneNumber) {
				const result = await sendSMSApi(
					phoneNumber as string,
					verificationToken.token
				);
				console.log("result", result);
				const data = await result.json();
				if (!result.status?.toString().startsWith("2")) {
					throw new SMSSendingError(data.message);
				}
				// const smsResponse = await sendSMS(
				// 	user.phoneNumber,
				// 	resetPasswordToken.token
				// );
				// console.log("message", smsResponse);
				message =
					"Phone number is not verified, please check your phone for verification OTP";
			}

			await tokenRepository.save(verificationToken);

			throw new AccountNotVerifiedError(message);
		}

		const token = generateToken(
			user,
			TokenTypes.RESET_PASSWORD_TOKEN,
			resetPasswordExpirationSeconds
		);

		await tokenRepository.save(token);

		let message = "";
		if (email) {
			await sendPasswordResetEmail(user, token);
			message = "Password reset OTP sent successfully to your email";
		} else if (phoneNumber) {
			const result = await sendSMSApi(phoneNumber as string, token.token);
			console.log("result", result);
			const data = await result.json();
			if (!result.status?.toString().startsWith("2")) {
				throw new SMSSendingError(data.message);
			}
			// const smsResponse = await sendSMS(user.phoneNumber, token.token);
			// console.log("message", smsResponse);
			message = "Password reset OTP sent successfully to your phone number";
		}
		user.passwordHash = undefined;

		res.status(200).json(
			new CustomResponse(true, message, {
				user,
			})
		);
	});

	resetPassword = catchAsync(async (req: Request, res: Response) => {
		const { email, phoneNumber, token, password } = req.body;
		console.log("req.body", req.body);

		const user = await userRepository.findOne({
			where: [{ email }, { phoneNumber }],
		});

		if (!user) {
			throw new ResourceNotFoundError("User not found");
		}

		const resetToken = await tokenRepository.findOne({
			where: {
				token,
				user: { id: user.id },
				type: TokenTypes.RESET_PASSWORD_TOKEN,
			},
		});

		if (!resetToken) {
			throw new ResourceNotFoundError("Token not found");
		}

		if (resetToken.expirationDate < new Date()) {
			throw new BadRequest("Token is expired");
		}

		user.passwordHash = await bcryptHash(password);

		await userRepository.save(user);

		// await tokenRepository.remove(resetToken);

		const authToken = generateJWTToken(user);

		res.status(200).json(
			new CustomResponse(true, "Password reset successfully", {
				...authToken,
			})
		);
	});

	changePassword = catchAsync(async (req: Request, res: Response) => {
		const { oldPassword, newPassword } = req.body;

		const user = await userRepository.findOne({ where: { id: req.user.id } });

		if (!user) {
			throw new ResourceNotFoundError("User not found");
		}

		const isValid = await bcryptCompare(oldPassword, user.passwordHash);

		if (!isValid) {
			throw new unauthunticatedError("Invalid credentials");
		}

		user.passwordHash = await bcryptHash(newPassword);

		await userRepository.save(user);

		res
			.status(200)
			.json(new CustomResponse(true, "Password changed successfully"));
	});

	unlock = catchAsync(async (req: Request, res: Response) => {
		const { accountNumber } = req.body;

		const user = await userRepository.findOne({ where: {} });

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
}
