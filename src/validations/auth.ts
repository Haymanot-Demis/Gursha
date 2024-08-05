import * as Joi from "joi";

export const authScema = {
	register: Joi.object({
		fullname: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
		phoneNumber: Joi.string().required(),
		isMobile: Joi.boolean().required(),
	}),
	login: Joi.object({
		email: Joi.string().email(),
		phoneNumber: Joi.string(),
		password: Joi.string().min(6).required(),
	}).or("email", "phoneNumber"),
};
