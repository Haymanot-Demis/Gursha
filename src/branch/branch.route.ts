import { Router } from "express";

import BranchController from "./branch.controller";
import { authenticate } from "../common/middlewares/auth";

const router = Router();
const branchController = new BranchController();

router.post("/create", authenticate, branchController.create);
router.get("/getAll", authenticate, branchController.getAll);
router.get("/getOne/:branchId", branchController.getOneById);
router.put("/update/:branchId", authenticate, branchController.update);
router.delete("/delete/:branchId", authenticate, branchController.delete);

export default router;
