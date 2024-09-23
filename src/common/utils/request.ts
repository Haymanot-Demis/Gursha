import { Request } from "../config/extended.express";
import { cloudinaryUploader } from "../services/cloudinary.fileupload.service";

const extractImages = async (req: Request) => {
	// @ts-ignore
	const images = req.files;

	if (!images) {
		return undefined;
	}

	const imageUrls = [];
	if (images) {
		for (const image of images) {
			const imageUrl = await cloudinaryUploader(image.path);
			imageUrls.push(imageUrl);
		}
	}
	return imageUrls;
};

export { extractImages };
