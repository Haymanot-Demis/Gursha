import { Request, Response, NextFunction } from "../config/extended.express";
import { verifyJWTToken } from "../utils/auth";
import userRepository from "../../user/user.repository";
import {
	ResourceNotFoundError,
	UnauthorizedError,
	unauthunticatedError,
} from "../utils/error";
import { errorMessages } from "../utils/serverResponseMessages";
import { catchAsync } from "../utils/asyncHandler";

const authenticate = catchAsync(
	async (req: Request, res: Response, next: NextFunction) => {
		const header = req.header("Authorization");

		if (!header)
			throw new unauthunticatedError(errorMessages(res).unuthenticated);

		const parts = header.split(" ");
		if (parts.length !== 2)
			throw new unauthunticatedError(errorMessages(res).unuthenticated);
		const token = parts[1];

		const { decoded, error } = verifyJWTToken(token);

		if (error)
			throw new unauthunticatedError(errorMessages(res).invalidJWTToken);

		const user = await userRepository.findOne({
			where: { id: decoded.id },
		});

		if (!user) throw new ResourceNotFoundError(errorMessages(res).userNotFound);

		req.user = user;
		next();
	}
);

const authRole = (roles: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.role))
			next(new UnauthorizedError(errorMessages(res).unauthorized));
		next();
	};
};

export { authenticate, authRole };
