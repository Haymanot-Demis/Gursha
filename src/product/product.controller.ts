import branchRepository from "../branch/branch.repository";
import businessRepository from "../business/business.respository";
import {
	Request,
	Response,
	NextFunction,
} from "../common/config/extended.express";
import { CustomResponse } from "../common/config/response";
import { catchAsync } from "../common/utils/asyncHandler";
import {
	ResourceAlreadyExistsError,
	ResourceNotFoundError,
} from "../common/utils/error";
import { extractImages } from "../common/utils/request";
import { errorMessages } from "../common/utils/serverResponseMessages";
import User from "../user/user.model";
import productRepository from "./product.repository";

export default class ProductController {
	getBusinessProduct = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { productId } = req.params;

			const product = await productRepository.findById(productId);

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
			const { businessId } = req.params;
			// todo: pagination
			const products = await productRepository.findByBusinessId(businessId);

			res.status(200).json(new CustomResponse(true, "", { products }));
		}
	);

	getMyBusinessProducts = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			// todo: pagination
			const products = await productRepository.findByBusinessId(business.id);

			res.status(200).json(new CustomResponse(true, "", { products }));
		}
	);

	addProduct = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			const isProductExist = await productRepository.findByName(req.body.name);

			if (isProductExist) {
				throw new ResourceAlreadyExistsError(errorMessages(res).productExist);
			}

			const { branches: branchIds = [] } = req.body;

			const branches = branchIds.map(async (branchId: string) => {
				const branch = await branchRepository.findById(branchId);
				if (!branch) {
					throw new ResourceNotFoundError(errorMessages(res).branchNotFound);
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

			res
				.status(201)
				.json(
					new CustomResponse(true, "", { ...product, business: undefined })
				);
		}
	);

	updateProduct = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const { productId } = req.params;

			const business = await businessRepository.findByUserId(id);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			const product = await productRepository.findByBusinessIdAndProductId(
				business.id,
				productId
			);

			const pictures = await extractImages(req);

			// update the product
			const updatedProduct = await productRepository.updateProduct({
				product,
				...req.body,
				pictures,
			});

			res
				.status(200)
				.json(new CustomResponse(true, "", { product: updatedProduct }));
		}
	);

	removeProduct = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { productId } = req.params;
			const product = await productRepository.findById(productId);

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
