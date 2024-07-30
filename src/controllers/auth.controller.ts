import { Request, Response } from "express";
import { CustomResponse } from "../config/response";
import User from "../models/user/model";
import { generateOTP } from "../utils/otpGenerator";
import {
	AccountNotVerifiedError,
	BadRequest,
	ResourceNotFoundError,
	unauthunticatedError,
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
import { string } from "joi";

export default class AuthController {
	register = catchAsync(async (req: Request, res: Response) => {
		const { fullname, email, password, phoneNumber, isMobile } = req.body;

		const userExist = await userRepository.findOne({ where: { email } });

		if (userExist) {
			throw new BadRequest("Email already exist, please login");
		}

		const user = new User();
		user.fullname = fullname;
		user.email = email;
		user.passwordHash = await bcryptHash(password);
		user.phoneNumber = phoneNumber;

		await userRepository.save(user);

		console.log(user);

		// sendSMS(user.phoneNumber, `OTP: ${generatePIN()}`);

		// send verification email
		await sendVerificationEmail(user, isMobile);
		user.passwordHash = undefined;

		res
			.status(201)
			.json(
				new CustomResponse(
					true,
					"Registered successfully, please check your email for verification",
					user
				)
			);
	});

	login = catchAsync(async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const user = await userRepository.findOne({ where: { email } });

		if (!user) {
			throw new ResourceNotFoundError("User not found");
		}

		if (!user.isEmailVerified) {
			// todo: resend verification email
			await sendVerificationEmail(user);
			throw new AccountNotVerifiedError(
				"Email is not verified, please check your email for verification token or link"
			);
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

		if (oldRefreshToken) {
			await tokenRepository.remove(oldRefreshToken);
		}

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

		return res.status(200).json({
			...token,
			user: refreshTokenExist.user,
			message: "Refresh token created",
		});
	});

	verifyEmail = catchAsync(async (req: Request, res: Response) => {
		const { email, token } = req.query;

		const user = await userRepository.findOne({
			where: { email: email as string },
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
			await sendVerificationEmail(user);
			throw new BadRequest(
				"Token is expired, please check your email for new token"
			);
		}

		await tokenRepository.remove(verificationToken);

		user.isEmailVerified = true;

		await userRepository.save(user);

		res
			.status(200)
			.json(new CustomResponse(true, "Email verified successfully"));
	});

	forgotPassword = catchAsync(async (req: Request, res: Response) => {
		const { email } = req.query;

		const user = await userRepository.findOne({
			where: { email: email as string },
		});

		if (!user) {
			throw new ResourceNotFoundError("User not found");
		}

		if (!user.isEmailVerified) {
			await sendVerificationEmail(user);
			throw new AccountNotVerifiedError(
				"Email is not verified, please check your email for verification token or link"
			);
		}

		const token = new Token();
		token.token = generateOTP(6);
		token.user = user;
		token.expirationDate = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
		token.type = TokenTypes.RESET_PASSWORD_TOKEN;

		await tokenRepository.save(token);

		await sendPasswordResetEmail(user, token);

		res.status(200).json(
			new CustomResponse(true, "Password reset email sent successfully", {
				user,
			})
		);
	});

	resetPassword = catchAsync(async (req: Request, res: Response) => {
		const { email, token, password } = req.body;

		const user = await userRepository.findOne({
			where: { email },
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

		await tokenRepository.remove(resetToken);

		const authToken = generateJWTToken(user);

		res.status(204).json(
			new CustomResponse(true, "Password reset successfully", {
				...authToken,
			})
		);
	});

	changePassword = catchAsync(async (req: Request, res: Response) => {
		const { oldPassword, newPassword } = req.body;

		// @ts-ignore
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
			.status(204)
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
