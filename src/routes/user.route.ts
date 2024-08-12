import { Router } from "express";
import UserController from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import { userSchema } from "./../validations/user.schema";

const router = Router();
const userController = new UserController();

router.put(
	"/updateProfile",
	validate(userSchema.updateProfile),
	userController.updateProfile
);

export default router;
