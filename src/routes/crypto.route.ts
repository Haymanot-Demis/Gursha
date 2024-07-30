import { Router } from "express";
import CryptoController from "../controllers/crypto.controller";

const router = Router();
const cryptoController = new CryptoController();

router.post("/encrypt", cryptoController.encrypt);
router.post("/decrypt", cryptoController.decrypt);

export default router;
