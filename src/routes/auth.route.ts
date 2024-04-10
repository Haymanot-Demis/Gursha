import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();
const authController = new AuthController();

router.post("/create", authController.create);
router.get("/activation-code", authController.getActivationCode); // allowed to the bank staff only
router.put("/activate", authController.activate);
router.post("/login", authController.login);
router.put("/change-pin", authController.changePIn);
router.put("/unlock", authController.unlock); // allowed to the bank staff only

export default router;
