import { Router } from "express";
import ProductController from "./product.controller";
import { authenticate } from "../common/middlewares/auth";
import { uploadImage } from "../common/middlewares/fileUpload";

const router = Router();
const productController = new ProductController();

router.post(
	"/addProduct",
	authenticate,
	uploadImage.array("pictures"),
	productController.addProduct
);
router.put(
	"/updateProduct/:productId",
	authenticate,
	uploadImage.array("pictures"),
	productController.updateProduct
);
router.get(
	"/getMyBusinessProducts",
	authenticate,
	productController.getMyBusinessProducts
);
router.get("/getProduct/:productId", productController.getBusinessProduct);
router.get("/getProducts/:businessId", productController.getBusinessProducts);
router.delete(
	"/removeProduct/:productId",
	authenticate,
	productController.removeProduct
);
router.delete(
	"/removeAllProducts",
	authenticate,
	productController.removeAllProducts
);

export default router;
