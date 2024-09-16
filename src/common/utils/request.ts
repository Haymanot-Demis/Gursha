import { Request } from "../config/extended.express";
import { cloudinaryUploader } from "../services/cloudinary.fileupload.service";

const extractImages = async (req: Request) => {
	// @ts-ignore
	const images = req.files;
	return images.map(async (image) => {
		return await cloudinaryUploader(image.path);
	});
};

export { extractImages };
