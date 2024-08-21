import { Request, Response, NextFunction } from "express";
import logger from "../middlewares/logger";

export const catchAsync =
	(fn: Function) => (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch((err) => {
			logger.error(err);
			next(err);
		});
	};
