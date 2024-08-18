import * as Joi from "joi";
import {
	passwordRegEx,
	phoneNumberRegEx,
} from "./../common/validations/common.schema";
import {
	phoneNumberRegExErrorMessage,
	strongPasswordErrorMessage,
} from "./../common/validations/joiErroroMessages";
import { Role } from "../common/config/constants";

const InvalidCredentials = "Invalid email or password";
export const authScema = {
	register: Joi.object({
		firstName: Joi.string().required().min(3).max(30),
		lastName: Joi.string().required().min(3).max(30),
		email: Joi.string().email(),
		password: Joi.string()
			.required()
			.min(6)
			.max(30)
			.pattern(passwordRegEx)
			.messages(strongPasswordErrorMessage),
		phoneNumber: Joi.string()
			.pattern(phoneNumberRegEx)
			.messages(phoneNumberRegExErrorMessage),
		role: Joi.string().required().valid(Role.CLIENT, Role.MERCHANT),
	})
		.or("email", "phoneNumber")
		.messages({
			"object.missing": "Either email or phone number is required.",
		}),
	login: Joi.object({
		email: Joi.string().email(),
		phoneNumber: Joi.string().pattern(phoneNumberRegEx),
		password: Joi.string().required().min(6).max(30).pattern(passwordRegEx),
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
		phoneNumber: Joi.string()
			.pattern(phoneNumberRegEx)
			.messages(phoneNumberRegExErrorMessage),
	}).or("email", "phoneNumber"),
	resetPassword: Joi.object({
		email: Joi.string().email(),
		phoneNumber: Joi.string()
			.pattern(phoneNumberRegEx)
			.messages(phoneNumberRegExErrorMessage),
		token: Joi.string().required().length(6),
		password: Joi.string()
			.required()
			.min(6)
			.max(30)
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
			.required()
			.min(6)
			.max(30)
			.pattern(passwordRegEx)
			.messages(strongPasswordErrorMessage),
	}),
	refreshToken: Joi.object({
		refreshToken: Joi.string().required(),
	}),
};
