import { Router } from "express";

import BranchManagerController from "./branchManager.controller";
import { authenticate } from "../common/middlewares/auth";

const router = Router();
const branchManagerController = new BranchManagerController();

router.get(
	"/getAllBMOfBusiness",
	authenticate,
	branchManagerController.getAllBMOfBusiness
);
router.get(
	"/getOneByBranchId/:branchId",
	authenticate,
	branchManagerController.getOneByBranchId
);
router.get(
	"/getOneById/:branchManagerId",
	authenticate,
	branchManagerController.getOneById
);

export default router;
