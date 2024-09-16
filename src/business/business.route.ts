import { Router } from "express";

import BusinessController from "./business.controller";
import { authenticate } from "../common/middlewares/auth";
import { uploadImage } from "../common/middlewares/fileUpload";

const router = Router();
const businessController = new BusinessController();

router.get(
	"/getMyBusinessInfo",
	authenticate,
	businessController.getMyBusinessInfo
);

router.get("/getBusiness/:businessId", businessController.getBusinessInfo);
router.get("/getManyBusinesses", businessController.getManyBusinesses);

router.put(
	"/updateBusinessInfo",
	authenticate,
	businessController.updateBusinessInfo
);

router.put(
	"/updateBannerPhoto",
	authenticate,
	uploadImage.single("bannerPhoto"),
	businessController.updateBusinessBanner
);

router.put(
	"/removeBannerPhoto",
	authenticate,
	businessController.removeBusinessBanner
);

router.put(
	"/updateLogo",
	authenticate,
	uploadImage.single("logo"),
	businessController.updateBusinessLogo
);

router.put("/removeLogo", authenticate, businessController.removeBusinessLogo);

router.put(
	"/submitForReview",
	authenticate,
	businessController.submitForReview
);

router.get(
	"/getBusinessesReadyForReview",
	authenticate,
	businessController.getBusinessesReadyForReview
);

router.put(
	"/verifyBusiness/:id",
	authenticate,
	businessController.verifyBusiness
);

export default router;
