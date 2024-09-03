import { Router } from "express";

import BranchController from "./branch.controller";
import { authenticate } from "../common/middlewares/auth";

const router = Router();
const branchController = new BranchController();

router.post("/create", authenticate, branchController.create);
router.put("/update/:id", authenticate, branchController.update);

export default router;
