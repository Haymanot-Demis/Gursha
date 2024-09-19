import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../common/utils/asyncHandler";
import User from "../user/user.model";
import businessRepository from "./business.respository";
import { ResourceNotFoundError } from "../common/utils/error";
import { errorMessages } from "../common/utils/serverResponseMessages";
import { CustomResponse } from "../common/config/response";
import { cloudinaryUploader } from "../common/services/cloudinary.fileupload.service";

export default class BusinessController {
	getMyBusinessInfo = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			res
				.status(200)
				.json(new CustomResponse(true, "", { businessInfo: business }));
		}
	);

	getBusinessInfo = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { businessId } = req.params;
			const business = await businessRepository.findById(businessId);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			res.status(200).json(new CustomResponse(true, "", { business }));
		}
	);

	getManyBusinesses = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			let { page = 1, limit = 10 } = req.query;
			page = page as string;
			limit = limit as string;

			const offset = (parseInt(page) - 1) * parseInt(limit);

			const businesses = await businessRepository.find({
				where: {},
				relations: ["branches"],
				skip: offset,
				take: parseInt(limit),
			});

			const total = await businessRepository.count();
			const totalPages = Math.ceil(total / parseInt(limit));

			res.status(200).json(
				new CustomResponse(
					true,
					"",
					{ businesses },
					{
						totalItems: total,
						totalPages,
						currentPage: parseInt(page),
						limit: parseInt(limit),
					}
				)
			);
		}
	);

	updateBusinessBanner = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			// @ts-ignore
			business.bannerPhotoUrl = await cloudinaryUploader(req.file.path);

			const updatedBusiness = await businessRepository.save(business);

			res
				.status(200)
				.json(new CustomResponse(true, "", { businessInfo: updatedBusiness }));
		}
	);

	updateBusinessBannerById = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { businessId } = req.params;
			const business = await businessRepository.findById(businessId);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			// @ts-ignore
			business.bannerPhotoUrl = await cloudinaryUploader(req.file.path);

			const updatedBusiness = await businessRepository.save(business);

			res
				.status(200)
				.json(new CustomResponse(true, "", { businessInfo: updatedBusiness }));
		}
	);

	removeBusinessBanner = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			business.bannerPhotoUrl = null;

			const updatedBusiness = await businessRepository.save(business);

			res
				.status(200)
				.json(new CustomResponse(true, "", { businessInfo: updatedBusiness }));
		}
	);

	removeBusinessBannerById = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { businessId } = req.params;
			const business = await businessRepository.findById(businessId);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			business.bannerPhotoUrl = null;

			const updatedBusiness = await businessRepository.save(business);

			res
				.status(200)
				.json(new CustomResponse(true, "", { businessInfo: updatedBusiness }));
		}
	);

	updateBusinessLogo = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			// @ts-ignore
			business.logoPhotoUrl = await cloudinaryUploader(req.file.path);

			const updatedBusiness = await businessRepository.save(business);

			res
				.status(200)
				.json(new CustomResponse(true, "", { businessInfo: updatedBusiness }));
		}
	);

	updateBusinessLogoById = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { businessId } = req.params;
			const business = await businessRepository.findById(businessId);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			// @ts-ignore
			business.logoPhotoUrl = await cloudinaryUploader(req.file.path);

			const updatedBusiness = await businessRepository.save(business);

			res
				.status(200)
				.json(new CustomResponse(true, "", { businessInfo: updatedBusiness }));
		}
	);

	removeBusinessLogo = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			business.logoPhotoUrl = null;

			const updatedBusiness = await businessRepository.save(business);

			res
				.status(200)
				.json(new CustomResponse(true, "", { businessInfo: updatedBusiness }));
		}
	);

	removeBusinessLogoId = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { businessId } = req.params;
			const business = await businessRepository.findById(businessId);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			business.logoPhotoUrl = null;

			const updatedBusiness = await businessRepository.save(business);

			res
				.status(200)
				.json(new CustomResponse(true, "", { businessInfo: updatedBusiness }));
		}
	);

	updateBusinessInfo = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			const updatedBusiness = await businessRepository.updateBusiness(
				business,
				req.body
			);

			res
				.status(200)
				.json(new CustomResponse(true, "", { businessInfo: updatedBusiness }));
		}
	);

	updateBusinessInfoById = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { businessId } = req.params;
			const business = await businessRepository.findById(businessId);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			const updatedBusiness = await businessRepository.updateBusiness(
				business,
				req.body
			);

			res
				.status(200)
				.json(new CustomResponse(true, "", { businessInfo: updatedBusiness }));
		}
	);

	submitForReview = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				return next(
					new ResourceNotFoundError(errorMessages(res).businessNotFound)
				);
			}

			business.isReadyForReview = true;
			const updatedBusiness = await businessRepository.save(business);

			// todo: Send email to sales team

			res
				.status(200)
				.json(new CustomResponse(true, "", { businessInfo: updatedBusiness }));
		}
	);

	getBusinessesReadyForReview = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const businesses = await businessRepository.findReadyForReview();

			res.status(200).json(new CustomResponse(true, "", { businesses }));
		}
	);

	verifyBusiness = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;
			const business = await businessRepository.findById(id);

			if (!business) {
				return next(
					new ResourceNotFoundError(errorMessages(res).businessNotFound)
				);
			}

			business.isVerified = true;
			business.isReadyForReview = false;
			const updatedBusiness = await businessRepository.save(business);

			// todo: Send email to business owner

			res
				.status(200)
				.json(new CustomResponse(true, "", { businessInfo: updatedBusiness }));
		}
	);
}
