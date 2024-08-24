import { Request, Response, NextFunction } from "express";
import * as customError from "../utils/error";
import { CustomResponse } from "../config/response";
import i18n from "../config/i18n";

export function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.log("errorHandler", err);
	console.log("isInstance", err instanceof customError.CustomError);

	if (err instanceof customError.CustomError) {
		if (err instanceof customError.ValidationError) {
			console.log("details", err.details);

			const { type } = err.details[0];
			const { key, peers } = err.details[0].context;

			res
				.status(err.statusCode)
				.json(new CustomResponse(false, res.__(key ?? peers[0])[type]));
		} else {
			res.status(err.statusCode).json(new CustomResponse(false, err.message));
		}
	} else {
		res.status(500).json(new CustomResponse(false, "Some thing went wrong"));
	}
}
