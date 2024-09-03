import { Router } from "express";
import authRouter from "./auth/auth.route";
import userRouter from "./user/user.route";
import branchRouter from "./branch/branch.route";
import branchManagerRouter from "./branchManager/branchManager.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/branch", branchRouter);
router.use("/branchManager", branchManagerRouter);

export default router;
