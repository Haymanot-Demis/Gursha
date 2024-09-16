import { Router } from "express";

import BranchProductController from "./branchProduct.controller";

const router = Router();
const branchProductController = new BranchProductController();

router.get("/getBranchProduct", branchProductController.getBranchProduct);
router.get("/getBranchProducts", branchProductController.getBranchProducts);
router.put("/addProductToBranch", branchProductController.addProductToBranch);
router.put("/updateBranchProduct", branchProductController.updateBranchProduct);
router.put(
	"/toggleProductAvailability",
	branchProductController.toggleProductAvailability
);
router.delete(
	"/removeProductFromBranch",
	branchProductController.removeProductFromBranch
);
router.delete(
	"/removeAllProductsFromBranch",
	branchProductController.removeAllProductsFromBranch
);

export default router;
