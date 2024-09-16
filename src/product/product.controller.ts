import branchRepository from "../branch/branch.repository";
import businessRepository from "../business/business.respository";
import {
	Request,
	Response,
	NextFunction,
} from "../common/config/extended.express";
import { CustomResponse } from "../common/config/response";
import { catchAsync } from "../common/utils/asyncHandler";
import { ResourceNotFoundError } from "../common/utils/error";
import { extractImages } from "../common/utils/request";
import { errorMessages } from "../common/utils/serverResponseMessages";
import User from "../user/user.model";
import productRepository from "./product.repository";

export default class ProductController {
	getBusinessProduct = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;

			const product = await productRepository.findById(id);

			if (!product) {
				return next(
					new ResourceNotFoundError(errorMessages(res).productNotFound)
				);
			}

			res.status(200).json(new CustomResponse(true, "", { product }));
		}
	);

	getBusinessProducts = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { BusinessId } = req.params;
			// todo: pagination
			const products = await productRepository.findByBusinessId(BusinessId);

			res.status(200).json(new CustomResponse(true, "", { products }));
		}
	);

	addProduct = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				return next(
					new ResourceNotFoundError(errorMessages(res).businessNotFound)
				);
			}

			const { branches: branchIds } = req.body;

			const branches = branchIds.map(async (branchId: string) => {
				const branch = await branchRepository.findById(branchId);
				if (!branch) {
					return next(
						new ResourceNotFoundError(errorMessages(res).branchNotFound)
					);
				}
				return branch;
			});

			const pictures = await extractImages(req);

			// create the product
			const product = await productRepository.createProduct({
				...req.body,
				pictures,
				business,
			});

			// add product to branches
			await productRepository.addProductToBranches(product, branches);
			// todo
			// if the role is merchant then add the product to the branches on the body
			// if the role is branch manager
			// then add the product to own
			// branch only and send the product to the merchant for approval

			res.status(201).json(new CustomResponse(true, "", { product }));
		}
	);

	updateProduct = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				return next(
					new ResourceNotFoundError(errorMessages(res).businessNotFound)
				);
			}

			const pictures = await extractImages(req);

			// update the product
			const product = await productRepository.updateProduct({
				...req.body,
				pictures,
			});

			res.status(200).json(new CustomResponse(true, "", { product }));
		}
	);

	removeProduct = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;
			const product = await productRepository.findById(id);

			if (!product) {
				return next(
					new ResourceNotFoundError(errorMessages(res).productNotFound)
				);
			}

			await productRepository.delete(product.id);

			res.status(204).json();
		}
	);

	removeAllProducts = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;

			const business = await businessRepository.findByUserId(id);

			if (!business) {
				return next(
					new ResourceNotFoundError(errorMessages(res).businessNotFound)
				);
			}

			const products = await productRepository.removeAllProducts(business.id);

			res.status(204).json();
		}
	);
}
