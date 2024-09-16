import { v2 } from "cloudinary";

v2.config(process.env.CLOUDINARY_URL);

// this is service for uploading images to cloudinary
const cloudinaryUploader = async (imagePath: string): Promise<string> => {
	const options = {
		use_filename: true,
		unique_filename: true,
		overwrite: true,
	};

	const result = await v2.uploader.upload(imagePath, { resource_type: "auto" });
	return result.secure_url;
};

export { cloudinaryUploader };
