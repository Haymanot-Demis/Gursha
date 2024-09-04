import { Router } from "express";

import BusinessController from "./business.controller";
import { authenticate } from "../common/middlewares/auth";

const router = Router();
const businessController = new BusinessController();

router.get(
	"/getBusinessInfo",
	authenticate,
	businessController.getBusinessInfo
);
router.put(
	"/updateBusinessInfo",
	authenticate,
	businessController.updateBusinessInfo
);

export default router;
