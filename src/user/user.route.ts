import { Router } from "express";
import UserController from "./user.controller";
import { validate } from "../common/middlewares/validate";
import { userSchema } from "./user.schema";
import { authenticate } from "../common/middlewares/auth";

const router = Router();
const userController = new UserController();

router.get("/getAll", userController.getAll);

router.get("/getOne/:id", userController.getUserById);

router.get("/getByRole", userController.getByRole);

router.put(
	"/updateProfile",
	validate(userSchema.updateProfile),
	userController.updateProfile
);

router.post(
	"/createSalesUserAccount",
	authenticate,
	userController.createSalesUserAccount
);
router.post(
	"/createBranchManagerUserAccount",
	authenticate,
	userController.createBranchManagerUserAccount
);

router.post(
	"/createCustomerSupportUserAccount",
	authenticate,
	userController.createCustomerSupportUserAccount
);

router.delete("/deleteUser", authenticate, userController.deleteUserAccount);
router.delete(
	"/deleteSalesUserAccount/:id",
	userController.deleteSalesUserAccount
);
router.delete(
	"/deleteBranchManagerUserAccount/:id",
	userController.deleteBranchManagerUserAccount
);
router.delete(
	"/deleteCustomerSupportUserAccount/:id",
	userController.deleteCustomerSupportUserAccount
);

export default router;
