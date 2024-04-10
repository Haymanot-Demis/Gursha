import otpgenerator from "otp-generator";
import bcrypt from "bcrypt";
import { SALT } from "../config/config";

const generatePIN = () => {
	return otpgenerator.generate(4, {
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false,
	});
};

export { generatePIN };
