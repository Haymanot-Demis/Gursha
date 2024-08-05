import twilio from "twilio";
import { UnknownError } from "../utils/error";
import {
	SMS_AID,
	SMS_API,
	SMS_KEY,
	TWILIO_ACCOUNT_SID,
	TWILIO_AUTH_TOKEN,
	TWILIO_PHONE_NUMBER,
} from "../config/config";

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const sendSMS = async (to: string, body: string) => {
	try {
		const response = await client.messages.create({
			body,
			from: TWILIO_PHONE_NUMBER,
			to,
		});
		console.log(response);

		return response;
	} catch (error) {
		console.log(error);
		throw new UnknownError("Failed to send SMS");
	}
};

export const sendPhoneNumberVerificationSMS = async (
	phoneNumber: string,
	otp: string
) => {
	const message = `Your OTP from Gursha: ${otp}`;
	return await sendSMS(phoneNumber, message);
};

export const sendSMSApi = async (phoneNumber: string, OTP: string) => {
	const result = await fetch(SMS_API, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			to: phoneNumber,
			body: `Your OTP is ${OTP}`,
			apiKey: {
				id: SMS_AID,
				key: SMS_KEY,
			},
		}),
	});

	return result;
};
