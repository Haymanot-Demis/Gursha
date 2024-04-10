import jwt from "jsonwebtoken";
import User from "../models/user/model";
import { JWT_SECRET, SALT } from "../config/config";
import bcrypt from "bcrypt";

const generateJWTToken = (user: User) => {
	return jwt.sign(
		{ accountNumber: user.accountNumber, role: user.role },
		JWT_SECRET
	);
};

const verifyJWTToken = (token: string) => {
	return jwt.verify(token, JWT_SECRET);
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
