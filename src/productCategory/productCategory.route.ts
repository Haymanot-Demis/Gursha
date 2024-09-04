import { Router } from "express";

import ProductCategoryController from "./productCategory.controller";

const router = Router();
const productController = new ProductCategoryController();

router.post("/buildTestTree", productController.buildTestTree);
router.post("/addRoot", productController.addRoot);
router.post("/addChild/:parentId", productController.addChild);
router.get("/getSubtree/:rootId", productController.getSubtree);
router.get("/getTree", productController.getTree);
router.get("/getCategory/:id", productController.getCategory);
router.get("/getChildren/:parentId", productController.getChildren);
router.get("/getLeaves", productController.getLeaves);
router.put("/updateCategory/:id", productController.updateCategory);
router.put("/changeParent/:childId", productController.changeParent);
router.delete("/deleteCategory/:id", productController.deleteCategory);
router.delete("/deleteSubtree/:rootId", productController.deleteSubtee);

export default router;
