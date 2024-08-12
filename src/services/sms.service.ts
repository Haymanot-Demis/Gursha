import twilio from "twilio";
import { UnknownError } from "../utils/error";
import { SMS_AID, SMS_API, SMS_KEY } from "../config/config";

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
