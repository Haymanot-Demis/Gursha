import { Router } from "express";
import TransactionController from "../controllers/transaction.controller";
import authToken from "../middlewares/auth";

const router = Router();
const transactionController = new TransactionController();

router.put("/transfer", authToken, transactionController.transfer);
router.get("/balance", authToken, transactionController.getBalance);

export default router;
