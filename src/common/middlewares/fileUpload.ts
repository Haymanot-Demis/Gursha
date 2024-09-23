import { Request } from "express";
import multer from "multer";
import crypto from "crypto";
import { BadRequest } from "./../utils/error";

// allowed image types
const imageTypes = ["jpeg", "png", "jpg", "gif"];
// allowed file types docx, pdf
const fileTypes = [
	"application/msword",
	"application/pdf",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"text/plain",
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"text/csv",
];
// allowed video types mp4, avi, mkv, mpeg, mov, wmv, webm
const videoTypes = [
	"video/mp4",
	"video/avi",
	"video/mkv",
	"video/mpeg",
	"video/mov",
	"video/wmv",
	"video/webm",
];

// uploaded files folder destination
const imageDest = "uploads/images/";
const fileDest = "uploads/files/";
const videoDest = "uploads/videos/";

// customizing file name
const filename = (req: Request, file, cb) => {
	// spliting filename and extension
	let [fname, extname] = file.originalname.split(".");

	let customFileName =
		fname + crypto.randomBytes(5).toString("hex") + "." + extname;
	cb(null, customFileName);
};

// defining disk storage for images, files and videos with destination and filename
const imageStorage = multer.diskStorage({
	destination: function (req: Request, file, cb) {
		cb(null, imageDest);
	},
	filename: filename,
});

const fileStorage = multer.diskStorage({
	destination: function (req: Request, file, cb) {
		cb(null, fileDest);
	},
	filename: filename,
});

const videoStorage = multer.diskStorage({
	destination: function (req: Request, file, cb) {
		cb(null, videoDest);
	},
	filename: filename,
});

// file type valiation
const imageFileFilter = (req: Request, file, cb) => {
	const ls = file.originalname.split(".");
	const ext = ls[ls.length - 1];

	if (imageTypes.includes(ext.toLowerCase())) {
		return cb(null, true);
	}
	cb(new BadRequest(`${ext} File type not supported`), false);
};

// DocFile type valiation
const docFileFilter = (req: Request, file, cb) => {
	const ls = file.originalname.split(".");
	const ext = ls[ls.length - 1];

	if (fileTypes.includes(ext.toLowerCase())) {
		return cb(null, true);
	}
	cb(new BadRequest(`${ext} File type not supported`), false);
};

// Video type valiation
const videoFileFilter = (req: Request, file, cb) => {
	const ls = file.originalname.split(".");
	const ext = ls[ls.length - 1];

	if (videoTypes.includes(ext.toLowerCase())) {
		return cb(null, true);
	}
	cb(new BadRequest(`${ext} File type not supported`), false);
};

// multer upload middleware for images, files and videos
const uploadImage = multer({
	storage: imageStorage,
	fileFilter: imageFileFilter,
});
const uploadFile = multer({ storage: fileStorage, fileFilter: docFileFilter });
const uploadVideo = multer({
	storage: videoStorage,
	fileFilter: videoFileFilter,
});

// upload any file
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/any");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });

export { upload, uploadImage, uploadFile, uploadVideo };
