import twilio from "twilio";
import { UnknownError } from "../utils/error";
import {
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
