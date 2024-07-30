import otpgenerator from "otp-generator";

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

export { generatePIN, generateOTP };
