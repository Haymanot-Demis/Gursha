import { Router } from "express";
import authRouter from "./auth/auth.route";
import userRouter from "./user/user.route";
import businessRouter from "./business/business.route";
import branchRouter from "./branch/branch.route";
import branchManagerRouter from "./branchManager/branchManager.route";
import productCategoryRouter from "./productCategory/productCategory.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/business", businessRouter);
router.use("/branch", branchRouter);
router.use("/branchManager", branchManagerRouter);
router.use("/productCategory", productCategoryRouter);

export default router;
