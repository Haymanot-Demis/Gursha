import * as nodemailer from "nodemailer";
import { MAIL_HOST, MAIL_PASSWORD, MAIL_USERNAME } from "./../config/config";
import { getHtmlFile } from "./../config/email.html.file";
import User from "../models/user/model";
import Token from "../models/verificationCode/model";
import { APP_ORIGIN } from "../config/config";
import { generateOTP } from "../utils/otpGenerator";
import { TokenTypes } from "../config/constants";
import tokenRepository from "../repositories/token.repository";

const transporter = nodemailer.createTransport({
	service: "Gmail",
	host: MAIL_HOST,
	secure: true,
	auth: {
		user: MAIL_USERNAME,
		pass: MAIL_PASSWORD,
	},
});

export const sendMail = async (credentials: any) => {
	const html = getHtmlFile(credentials, null, null);

	try {
		return await transporter.sendMail({
			from: MAIL_USERNAME,
			to: credentials.to,
			subject: credentials.intent,
			html: html,
		});
	} catch (error) {
		console.log(error.message);
		return error;
	}
};

export const sendVerificationEmail = async (
	user: User,
	isFromMobileApp: boolean = false
) => {
	// Generate token
	const token = new Token();
	token.token = generateOTP(6);
	token.user = user;
	token.expirationDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
	token.type = TokenTypes.VERIFY_EMAIL_TOKEN;

	await tokenRepository.save(token);

	// Send email
	const credentials = {
		intent: "Email Verification Request",
		link: `${APP_ORIGIN}/api/v1/auth/verifyEmail?email=${user.email}&token=${token.token}`,
		to: user.email,
		proc: "email verification",
		extra: "please verify your email address by clicking the link below.",
	};

	if (isFromMobileApp) {
		credentials.extra = "Your OTP is: " + token.token;
		delete credentials.link;
	}

	return await sendMail(credentials);
};

export const sendPasswordResetEmail = async (
	user: User,
	token: Token,
	isFromMobileApp = true
) => {
	// Send email
	const credentials = {
		intent: "Reset Password Request",
		// link to redirect to the reset password page
		// TODO: add this in env variables as we also have test fronend environment
		link: `${APP_ORIGIN}/api/v1/auth/resetPassword`,
		to: user.email,
		proc: "password reseting",
		extra: "Please click the link below to reset your password",
	};

	if (isFromMobileApp) {
		credentials.extra = "Your OTP is: " + token.token;
		delete credentials.link;
	}

	return await sendMail(credentials);
};
