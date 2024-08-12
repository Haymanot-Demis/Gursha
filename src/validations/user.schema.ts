import * as Joi from "joi";

export const userSchema = {
	updateProfile: Joi.object({
		firstname: Joi.string().min(2).max(50).optional(),
		lastname: Joi.string().min(2).max(50).optional(),
	}),
};
