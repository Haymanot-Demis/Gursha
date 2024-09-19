import {
	Request,
	Response,
	NextFunction,
} from "../common/config/extended.express";
import { CustomResponse } from "../common/config/response";
import { catchAsync } from "../common/utils/asyncHandler";
import { ResourceNotFoundError } from "../common/utils/error";
import { errorMessages } from "../common/utils/serverResponseMessages";
import branchProductRepository from "./branchProduct.repository";

export default class BranchProdctController {
	getBranchProduct = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;

			const product = await branchProductRepository.findById(id);

			if (!product) {
				return next(
					new ResourceNotFoundError(errorMessages(res).branchProductNotFound)
				);
			}

			res.status(200).json(new CustomResponse(true, "", { product }));
		}
	);

	getBranchProducts = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			// todo: pagination
			const { branchId } = req.params;

			const products = await branchProductRepository.findByBranchId(branchId);

			res.status(200).json(new CustomResponse(true, "", { products }));
		}
	);

	addProductToBranch = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { branchId, productId, stockAmount, price } = req.body;

			const product = await branchProductRepository.findByBranchIdAndProdId(
				branchId,
				productId
			);

			if (product) {
				return next(
					new ResourceNotFoundError(errorMessages(res).branchProductExists)
				);
			}

			const branchProduct = await branchProductRepository.addProductToBranch({
				branchId,
				productId,
				stockAmount,
				price,
			});

			res.status(200).json(new CustomResponse(true, "", { branchProduct }));
		}
	);

	updateBranchProduct = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;

			const branchProduct = await branchProductRepository.findById(id);

			if (!branchProduct) {
				return next(
					new ResourceNotFoundError(errorMessages(res).branchProductNotFound)
				);
			}

			console.log("req.body", req.body);

			await branchProductRepository.updateBranchProduct({
				branchProduct,
				...req.body,
			});

			res.status(200).json(new CustomResponse(true, "", { branchProduct }));
		}
	);

	removeProductFromBranch = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;

			const branchProduct = await branchProductRepository.findById(id);

			if (!branchProduct) {
				return next(
					new ResourceNotFoundError(errorMessages(res).branchProductNotFound)
				);
			}

			await branchProductRepository.delete(branchProduct.id);

			res.status(200).json(new CustomResponse(true, ""));
		}
	);

	removeAllProductsFromBranch = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { branchId } = req.params;

			const branchProducts = await branchProductRepository.findByBranchId(
				branchId
			);

			if (!branchProducts) {
				return next(
					new ResourceNotFoundError(errorMessages(res).branchProductNotFound)
				);
			}

			await branchProductRepository.remove(branchProducts);

			res.status(200).json(new CustomResponse(true, ""));
		}
	);

	toggleProductAvailability = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;

			const branchProduct = await branchProductRepository.findById(id);

			if (!branchProduct) {
				return next(
					new ResourceNotFoundError(errorMessages(res).branchProductNotFound)
				);
			}

			branchProduct.isAvailable = !branchProduct.isAvailable;
			await branchProductRepository.save(branchProduct);

			res.status(200).json(new CustomResponse(true, "", { branchProduct }));
		}
	);
}
