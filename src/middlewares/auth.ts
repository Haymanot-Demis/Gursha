import { Request, Response, NextFunction } from "express";
import { verifyJWTToken } from "../utils/auth";
import userRepository from "../repositories/user.repository";
import { ResourceNotFoundError } from "../utils/error";

const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const header = req.header("Authorization");

	if (!header) return res.status(401).send("No auth header");

	const parts = header.split(" ");
	if (parts.length !== 2) return res.status(401).send("No token provided");
	const token = parts[1];

	try {
		const decoded = verifyJWTToken(token);
		const user = await userRepository.findOne({
			where: { id: decoded.id },
		});
		if (!user) throw new ResourceNotFoundError(`User not found`);

		// @ts-ignore
		req.user = user;
		next();
	} catch (err) {
		res.status(401).send("Invalid token");
	}
};

const authRole = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		// @ts-ignore
		if (!roles.includes(req.user.role))
			return res.status(403).send("Unauthorized");
		next();
	};
};

export { authenticate, authRole };
