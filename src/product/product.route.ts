import { Router } from "express";
import ProductController from "./product.controller";

const router = Router();
const productController = new ProductController();

router.post("/addProduct", productController.addProduct);
router.put("/updateProduct", productController.updateProduct);
router.get("/getProduct", productController.getBusinessProduct);
router.get("/getProducts", productController.getBusinessProducts);
router.delete("/removeProduct", productController.removeProduct);
router.delete("/removeAllProducts", productController.removeAllProducts);

export default router;
