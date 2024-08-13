import { Router } from "express";
import UserController from "./user.controller";
import { validate } from "../common/middlewares/validate";
import { userSchema } from "./user.schema";

const router = Router();
const userController = new UserController();

router.put(
	"/updateProfile",
	validate(userSchema.updateProfile),
	userController.updateProfile
);

export default router;
