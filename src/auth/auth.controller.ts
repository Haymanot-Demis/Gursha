import {
	Request,
	Response,
	NextFunction,
} from "../common/config/extended.express";
import { CustomResponse } from "../common/config/response";
import User from "../user/user.model";
import { generateToken } from "../common/utils/otpGenerator";
import {
	AccountNotVerifiedError,
	BadRequest,
	InvalidOrExpiredTokenError,
	ResourceAlreadyExistsError,
	ResourceNotFoundError,
	SMSSendingError,
	unauthunticatedError,
} from "../common/utils/error";
import userRepository from "./../user/user.repository";
import {
	bcryptHash,
	bcryptCompare,
	generateJWTToken,
	verifyJWTToken,
} from "../common/utils/auth";
import { catchAsync } from "../common/utils/asyncHandler";
import {
	sendPasswordResetEmail,
	sendVerificationEmail,
} from "../common/services/email.service";
import Token from "../token/token.model";
import { TokenTypes } from "../common/config/constants";
import tokenRepository from "../token/token.repository";
import { sendSMSApi } from "../common/services/sms.service";
import {
	resetPasswordExpirationSeconds,
	verifyEmailOrPhoneNumberExpirationSeconds,
} from "../common/config/config";
import {
	errorMessages,
	successMessages,
} from "../common/utils/serverResponseMessages";

export default class AuthController {
	register = catchAsync(async (req: Request, res: Response) => {
		const {
			firstName,
			lastName,
			email,
			password,
			phoneNumber,
			role,
			isMobile,
		} = req.body;

		const userExist = await userRepository.findOne({
			where: [{ email }, { phoneNumber }],
		});

		if (userExist) {
			let errMessage = email
				? errorMessages(res).emailAlreadyExists
				: errorMessages(res).phoneNumberAlreadyExists;
			throw new ResourceAlreadyExistsError(errMessage);
		}

		const user = new User();
		user.firstName = firstName;
		user.lastName = lastName;
		user.email = email;
		user.passwordHash = await bcryptHash(password);
		user.phoneNumber = phoneNumber;
		user.role = role;

		await userRepository.save(user);

		const token = generateToken(
			user,
			TokenTypes.VERIFY_EMAIL_TOKEN,
			verifyEmailOrPhoneNumberExpirationSeconds
		);

		await tokenRepository.save(token);
		let message = "";
		if (email) {
			await sendVerificationEmail(user, token);
			message = successMessages(res).registrationWithEmailSuccessful;
		} else if (phoneNumber) {
			const OTP = generateToken(
				user,
				TokenTypes.VERIFY_EMAIL_TOKEN,
				verifyEmailOrPhoneNumberExpirationSeconds
			);

			try {
				const result = await sendSMSApi(phoneNumber, OTP.token);
				const data = await result.json();
				if (!result.status?.toString().startsWith("2")) {
					throw new SMSSendingError(data.message);
				}
				await tokenRepository.save(OTP);
			} catch (error) {
				throw new SMSSendingError(error.message);
			}
			message = successMessages(res).registrationWithPhoneSuccessful;
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
			throw new ResourceNotFoundError(errorMessages(res).invalidCredentials);
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
				message = errorMessages(res).emailNotVerified;
			} else if (phoneNumber) {
				const result = await sendSMSApi(phoneNumber, verificationToken.token);
				const data = await result.json();
				if (!result.status?.toString().startsWith("2")) {
					throw new SMSSendingError(data.message);
				}
				message = errorMessages(res).phoneNotVerified;
			}

			await tokenRepository.save(verificationToken);

			throw new AccountNotVerifiedError(message);
		}

		if (user.failedLoginAttempts > 3 || user.isAccountLocked) {
			throw new unauthunticatedError(errorMessages(res).accountLocked);
		}

		const isMatch = await bcryptCompare(password, user.passwordHash);

		if (!isMatch) {
			user.failedLoginAttempts += 1;
			user.isAccountLocked = user.failedLoginAttempts >= 3;
			await userRepository.save(user);
			throw new unauthunticatedError(errorMessages(res).invalidCredentials);
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

		res.status(200).json(
			new CustomResponse(true, successMessages(res).loginSuccessful, {
				...token,
				user,
			})
		);
	});

	refreshToken = catchAsync(async (req: Request, res: Response) => {
		const { refreshToken } = req.body;

		const refreshTokenExist = await tokenRepository.findOne({
			where: { token: refreshToken },
			relations: ["user"],
		});

		if (!refreshTokenExist) {
			throw new ResourceNotFoundError(errorMessages(res).invalidJWTToken);
		}

		const { error } = verifyJWTToken(refreshTokenExist.token);
		console.log("lang", req.query.lang);

		if (error)
			throw new InvalidOrExpiredTokenError(errorMessages(res).invalidJWTToken);

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

		return res.status(200).json(
			new CustomResponse(true, successMessages(res).refreshTokenCreated, {
				...token,
				user: refreshTokenExist.user,
			})
		);
	});

	verifyEmailOrPhoneNumber = catchAsync(async (req: Request, res: Response) => {
		const { email, phoneNumber, token } = req.query;

		const user = await userRepository.findOne({
			where: [
				{ email: email as string },
				{ phoneNumber: phoneNumber as string },
			],
		});

		if (!user) {
			throw new ResourceNotFoundError(errorMessages(res).userNotFound);
		}

		if (user.isEmailVerified) {
			throw new BadRequest(errorMessages(res).emailAlreadyVerified);
		}

		const verificationToken = await tokenRepository.findOne({
			where: {
				token: token as string,
				user: { id: user.id },
				type: TokenTypes.VERIFY_EMAIL_TOKEN,
			},
		});

		if (!verificationToken) {
			throw new ResourceNotFoundError(errorMessages(res).tokenNotFound);
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
				message = errorMessages(res).emailVerificationTokenExpired;
			} else if (phoneNumber) {
				const result = await sendSMSApi(phoneNumber as string, newToken.token);
				const data = await result.json();
				if (!result.status?.toString().startsWith("2")) {
					throw new SMSSendingError(data.message);
				}
				message = errorMessages(res).phoneVerificationTokenExpired;
			}
			throw new BadRequest(message);
		}

		user.isEmailVerified = true;

		const authToken = generateJWTToken(user);

		const refreshToken = new Token();
		refreshToken.token = authToken.refreshToken;
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

		await userRepository.save(user);
		user.passwordHash = undefined;

		res.status(200).json(
			new CustomResponse(true, successMessages(res).verificationSuccessful, {
				user,
				...authToken,
			})
		);
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
			throw new ResourceNotFoundError(errorMessages(res).userNotFound);
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
				message = errorMessages(res).emailNotVerified;
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
				message = errorMessages(res).phoneNotVerified;
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
			message = successMessages(res).passwordResetTokenSentToEmail;
		} else if (phoneNumber) {
			const result = await sendSMSApi(phoneNumber as string, token.token);
			const data = await result.json();
			if (!result.status?.toString().startsWith("2")) {
				throw new SMSSendingError(data.message);
			}
			message = successMessages(res).passwordResetTokenSentToPhone;
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

		const user = await userRepository.findOne({
			where: [{ email }, { phoneNumber }],
		});

		if (!user) {
			throw new ResourceNotFoundError(errorMessages(res).userNotFound);
		}

		const resetToken = await tokenRepository.findOne({
			where: {
				token,
				user: { id: user.id },
				type: TokenTypes.RESET_PASSWORD_TOKEN,
			},
		});

		if (!resetToken) {
			throw new ResourceNotFoundError(errorMessages(res).tokenNotFound);
		}

		if (resetToken.expirationDate < new Date()) {
			throw new BadRequest(errorMessages(res).passwordResetTokenExpired);
		}

		user.passwordHash = await bcryptHash(password);

		const authToken = generateJWTToken(user);

		const refreshToken = new Token();
		refreshToken.token = authToken.refreshToken;
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

		await userRepository.save(user);
		user.passwordHash = undefined;

		res.status(200).json(
			new CustomResponse(true, successMessages(res).passwordResetSuccessful, {
				user,
				...authToken,
			})
		);
	});

	changePassword = catchAsync(async (req: Request, res: Response) => {
		const { oldPassword, newPassword } = req.body;

		const user = await userRepository.findOne({ where: { id: req.user.id } });

		if (!user) {
			throw new ResourceNotFoundError(errorMessages(res).userNotFound);
		}

		const isValid = await bcryptCompare(oldPassword, user.passwordHash);

		if (!isValid) {
			throw new unauthunticatedError(errorMessages(res).invalidCredentials);
		}

		user.passwordHash = await bcryptHash(newPassword);

		await userRepository.save(user);

		res
			.status(200)
			.json(
				new CustomResponse(
					true,
					successMessages(res).passwordChangedSuccessfully
				)
			);
	});

	unlock = catchAsync(async (req: Request, res: Response) => {
		const { accountNumber } = req.body;

		const user = await userRepository.findOne({ where: {} });

		if (!user) {
			throw new ResourceNotFoundError(errorMessages(res).userNotFound);
		}

		user.failedLoginAttempts = 0;
		user.isAccountLocked = false;

		await userRepository.save(user);

		res
			.status(200)
			.json(new CustomResponse(true, "Account unlocked successfully"));
	});
}
