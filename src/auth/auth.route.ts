import { Router } from "express";
import AuthController from "./auth.controller";
import { authenticate } from "../common/middlewares/auth";
import passport from "passport";
import User from "../user/user.model";
import { generateJWTToken } from "../common/utils/auth";
import Token from "../token/token.model";
import { TokenTypes, validationSource } from "../common/config/constants";
import tokenRepository from "../token/token.repository";
import { CustomResponse } from "../common/config/response";
import { validate } from "../common/middlewares/validate";
import { authScema } from "./auth.schema";
import logger from "../common/middlewares/logger";

const router = Router();
const authController = new AuthController();

router.post("/register", validate(authScema.register), authController.register);
router.post("/login", validate(authScema.login), authController.login);
router.put(
	"/refreshToken",
	validate(authScema.refreshToken),
	authController.refreshToken
);
router.get(
	"/verifyEmailOrPhoneNumber",
	validate(authScema.verifyEmailOrPhoneNumber, validationSource.QUERY),
	authController.verifyEmailOrPhoneNumber
);
router.get(
	"/forgotPassword",
	validate(authScema.forgetPassword, validationSource.QUERY),
	authController.forgotPassword
);
router.put(
	"/changePassword",
	validate(authScema.changePassword),
	authenticate,
	authController.changePassword
);
router.put(
	"/resetPassword",
	validate(authScema.resetPassword),
	authController.resetPassword
);
router.put("/unlock", authController.unlock);

router.post("/google", authController.loginWithGoogle);
router.delete("/remove/:id", authController.remove);

export default router;
