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

router.get("/google", passport.authenticate("google"));
router.get(
	"/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/api/v1/auth/google/error",
	}),
	async (req, res) => {
		console.log("req.user", req.user);
		const user = req.user as User;
		const token = generateJWTToken(user);

		const refreshToken = new Token();
		refreshToken.token = token.refreshToken;
		refreshToken.user = user;
		refreshToken.expirationDate = new Date(
			Date.now() + 7 * 24 * 60 * 60 * 1000
		); // 7 days
		refreshToken.type = TokenTypes.REFRESH_TOKEN;

		// todo: we have to remove the previous refresh token
		const oldRefreshToken = await tokenRepository.findOne({
			where: { user: { id: user.id }, type: TokenTypes.REFRESH_TOKEN },
		});

		await tokenRepository.save(refreshToken);
		user.passwordHash = undefined;

		res
			.status(200)
			.json(new CustomResponse(true, "Login successful", { ...token, user }));
	}
);

router.get("/google/error", (req, res, info) => {
	console.log("info", info);

	res.send("Error logging in with Google");
});

export default router;
