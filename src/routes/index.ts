import { Router } from "express";
import authRouter from "./auth.route";
import transactionRouter from "./transaction.route";
import cryptoRouter from "./crypto.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/transaction", transactionRouter);
router.use("/crypto", cryptoRouter);

export default router;
