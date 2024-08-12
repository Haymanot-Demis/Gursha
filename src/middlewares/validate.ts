import Joi from "joi";
import { catchAsync } from "./../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "./../utils/error";
import { validationSource } from "../config/constants";

export const validate = (
	schema: Joi.ObjectSchema<any>,
	src: validationSource = validationSource.BODY
) => {
	return catchAsync(
		(request: Request, response: Response, next: NextFunction) => {
			const objectToValidate = request[src];
			const { error } = schema.validate(objectToValidate, {
				abortEarly: true,
				allowUnknown: true,
			});
			if (error) {
				console.log(error);
				throw new ValidationError(error.details[0].message);
			} else {
				next();
			}
		}
	);
};
