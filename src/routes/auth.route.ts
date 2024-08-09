import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth";
import passport from "passport";
import User from "../models/user/model";
import { generateJWTToken } from "../utils/auth";
import Token from "../models/verificationCode/model";
import { TokenTypes } from "../config/constants";
import tokenRepository from "../repositories/token.repository";
import { CustomResponse } from "../config/response";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/refreshToken", authController.refreshToken);
router.get("/verifyEmail", authController.verifyEmailOrPhoneNumber);
router.get("/forgotPassword", authController.forgotPassword);
router.put("/changePassword", authenticate, authController.changePassword);
router.put("/resetPassword", authController.resetPassword);
router.put("/unlock", authController.unlock); // allowed to the bank staff only

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
