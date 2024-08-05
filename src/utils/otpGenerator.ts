import otpgenerator from "otp-generator";
import Token from "../models/verificationCode/model";
import User from "../models/user/model";
import { TokenTypes } from "../config/constants";

const generatePIN = () => {
	return otpgenerator.generate(4, {
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false,
	});
};
const generateOTP = (length: Number) =>
	otpgenerator.generate(length, {
		digits: true,
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false,
	});

const generateToken = (
	user: User,
	type: TokenTypes,
	expirationDate: number
) => {
	console.log("expirationDate", expirationDate);

	// Generate token
	const token = new Token();
	token.token = generateOTP(6);
	token.user = user;
	token.expirationDate = new Date(Date.now() + expirationDate * 1000);
	token.type = type;

	return token;
};

export { generatePIN, generateOTP, generateToken };
