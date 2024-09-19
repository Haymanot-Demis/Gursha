import { Router } from "express";

import BranchProductController from "./branchProduct.controller";
import { authenticate } from "../common/middlewares/auth";

const router = Router();
const branchProductController = new BranchProductController();

router.get("/getBranchProduct/:id", branchProductController.getBranchProduct);
router.get(
	"/getBranchProducts/:branchId",
	branchProductController.getBranchProducts
);
router.post(
	"/addProductToBranch",
	authenticate,
	branchProductController.addProductToBranch
);
router.put(
	"/updateBranchProduct/:id",
	authenticate,
	branchProductController.updateBranchProduct
);
router.put(
	"/toggleProductAvailability/:id",
	authenticate,
	branchProductController.toggleProductAvailability
);
router.delete(
	"/removeProductFromBranch",
	authenticate,
	branchProductController.removeProductFromBranch
);
router.delete(
	"/removeAllProductsFromBranch",
	authenticate,
	branchProductController.removeAllProductsFromBranch
);

export default router;
