import { Request, Response, NextFunction } from "express";
import * as customError from "../utils/error";

export function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.log("errorHandler", err);
	console.log("isInstance", err instanceof customError.CustomError);

	if (err instanceof customError.CustomError) {
		res.status(err.statusCode).json({ message: err.message });
	} else {
		res.status(500).json({ message: "Some thing went wrong" });
	}
}
