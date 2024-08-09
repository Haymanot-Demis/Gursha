import * as Joi from "joi";
import { passwordRegEx, phoneNumberRegEx } from "./common/common.schema";
import {
	phoneNumberRegExErrorMessage,
	strongPasswordErrorMessage,
} from "./common/joiErroroMessages";

const InvalidCredentials = "Invalid email or password";
export const authScema = {
	register: Joi.object({
		firstname: Joi.string().required().min(3).max(30),
		lastname: Joi.string().required().min(3).max(30),
		email: Joi.string().email(),
		password: Joi.string()
			.min(6)
			.required()
			.max(30)
			.pattern(passwordRegEx)
			.messages(strongPasswordErrorMessage),
		phoneNumber: Joi.string()
			.pattern(phoneNumberRegEx)
			.messages(phoneNumberRegExErrorMessage),
	}).or("email", "phoneNumber"),
	login: Joi.object({
		email: Joi.string().email(),
		phoneNumber: Joi.string().pattern(phoneNumberRegEx),
		password: Joi.string().min(6).required().pattern(passwordRegEx),
	})
		.or("email", "phoneNumber")
		.messages({
			"object.missing": InvalidCredentials,
			"string.empty": InvalidCredentials,
			"any.required": InvalidCredentials,
			"string.min": InvalidCredentials,
			"string.email": InvalidCredentials,
			"string.pattern.base": InvalidCredentials,
		}),
	forgetPassword: Joi.object({
		email: Joi.string().email(),
		phoneNumber: Joi.string().pattern(phoneNumberRegEx),
	})
		.or("email", "phoneNumber")
		.messages({
			"string.pattern.base":
				"Phone number must be in the format +251 9XX XXX XXX",
		}),
	resetPassword: Joi.object({
		email: Joi.string().email(),
		phoneNumber: Joi.string()
			.pattern(phoneNumberRegEx)
			.messages(phoneNumberRegExErrorMessage),
		token: Joi.string().required().length(6),
		password: Joi.string()
			.min(6)
			.required()
			.pattern(passwordRegEx)
			.messages(strongPasswordErrorMessage),
	}).or("email", "phoneNumber"),
	verifyEmailOrPhoneNumber: Joi.object({
		email: Joi.string().email(),
		phoneNumber: Joi.string()
			.pattern(phoneNumberRegEx)
			.messages(phoneNumberRegExErrorMessage),
		token: Joi.string().required().length(6),
	}).or("email", "phoneNumber"),
	changePassword: Joi.object({
		oldPassword: Joi.string().required().min(6),
		newPassword: Joi.string()
			.min(6)
			.required()
			.pattern(passwordRegEx)
			.messages(strongPasswordErrorMessage),
	}),
	refreshToken: Joi.object({
		refreshToken: Joi.string().required(),
	}),
};
