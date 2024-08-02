import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth";
import passport from "passport";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/refreshToken", authController.refreshToken);
router.get("/verifyEmail", authController.verifyEmail);
router.get("/forgotPassword", authController.forgotPassword);
router.put("/changePassword", authenticate, authController.changePassword);
router.put("/resetPassword", authController.resetPassword);
router.put("/unlock", authController.unlock); // allowed to the bank staff only

router.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
	"/google/callback",
	passport.authenticate("google", (req, res) => {
		console.log("req.user", req.user);
		res.send("Logged in successfully");
	})
);

export default router;
