import jwt from "jsonwebtoken";
import User from "../models/user/model";
import { JWT_SECRET, SALT } from "../config/config";
import bcrypt from "bcrypt";
import { unauthunticatedError } from "./error";

const generateJWTToken = (user: User) => {
	const accessToken = jwt.sign(
		{ id: user.id, email: user.email, role: user.role },
		JWT_SECRET,
		{ expiresIn: "15m" }
	);

	const refreshToken = jwt.sign(
		{ id: user.id, email: user.email, role: user.role },
		JWT_SECRET,
		{ expiresIn: "7d" }
	);

	return { accessToken, refreshToken };
};

const verifyJWTToken = (token: string) => {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		throw new unauthunticatedError("Invalid token");
	}
};

const bcryptHash = async (value): Promise<string> => {
	const saltValue = await bcrypt.genSalt(SALT);

	const hashed = await bcrypt.hash(value, saltValue);
	const hashed2 = await bcrypt.hash(value, saltValue);
	console.log(hashed, hashed2);

	return hashed;
};

const bcryptCompare = async (
	data: string,
	encrypted: string
): Promise<boolean> => {
	const isMatch = await bcrypt.compare(data, encrypted);
	return isMatch;
};

export { generateJWTToken, verifyJWTToken, bcryptHash, bcryptCompare };
