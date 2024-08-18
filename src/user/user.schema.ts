import * as Joi from "joi";

export const userSchema = {
	updateProfile: Joi.object({
		firstName: Joi.string().min(2).max(50).optional(),
		lastName: Joi.string().min(2).max(50).optional(),
	}),
};
