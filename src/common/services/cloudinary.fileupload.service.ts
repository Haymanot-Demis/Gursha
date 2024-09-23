import { v2 } from "cloudinary";
import fs from "fs";
import { join } from "path";
import logger from "../middlewares/logger";
import { BadRequest } from "../utils/error";

v2.config(process.env.CLOUDINARY_URL);

// this is service for uploading images to cloudinary
const cloudinaryUploader = async (imagePath: string): Promise<string> => {
	try {
		const options = {
			use_filename: true,
			unique_filename: true,
			overwrite: true,
		};

		if (!imagePath) {
			throw new BadRequest("file path is required");
		}

		const result = await v2.uploader.upload(imagePath, {
			resource_type: "auto",
		});

		// delete the file after uploading
		logger.info("Deleting local file after uploading to cloudinary");
		fs.unlinkSync(imagePath);

		return result.secure_url;
	} catch (error) {
		logger.error(`Error uploading image to cloudinary: ${error}`);
		throw new BadRequest("Error uploading image to cloudinary");
	}
};

export { cloudinaryUploader };
