import { Request, Response, NextFunction } from "express";
import IUser from "../models/user/interface";

interface ExtendedRequest extends Request {
	user: IUser;
}

export { ExtendedRequest as Request, Response, NextFunction };
