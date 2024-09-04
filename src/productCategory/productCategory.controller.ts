import {
	NextFunction,
	Request,
	Response,
} from "../common/config/extended.express";

import { CustomResponse } from "../common/config/response";
import { catchAsync } from "../common/utils/asyncHandler";
import { ResourceNotFoundError } from "../common/utils/error";
import { errorMessages } from "../common/utils/serverResponseMessages";
import ProductCategory from "./productCategory.model";
import productCategoryRepository from "./productCategory.repository";

export default class ProductCategoryController {
	buildTestTree = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const a1 = new ProductCategory();
			a1.name = "a1";
			await productCategoryRepository.save(a1);

			const a11 = new ProductCategory();
			a11.name = "a11";
			a11.parent = a1;
			await productCategoryRepository.save(a11);

			const a12 = new ProductCategory();
			a12.name = "a12";
			a12.parent = a1;
			await productCategoryRepository.save(a12);

			const a111 = new ProductCategory();
			a111.name = "a111";
			a111.parent = a11;
			await productCategoryRepository.save(a111);

			const a112 = new ProductCategory();
			a112.name = "a112";
			a112.parent = a11;
			await productCategoryRepository.save(a112);

			const a121 = new ProductCategory();
			a121.name = "a121";
			a121.parent = a12;
			await productCategoryRepository.save(a121);

			res.status(200).json(new CustomResponse(true, "", {}));
		}
	);

	addRoot = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const root = await productCategoryRepository.findRoots();
			const category = await productCategoryRepository.createCategory(req.body);
			if (root.length == 1) {
				root[0].parent = category;
				await productCategoryRepository.save(root[0]);
			}

			res.status(200).json(new CustomResponse(true, "", { category }));
		}
	);

	addChild = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { parentId } = req.params;
			const parent = await productCategoryRepository.findById(parentId);

			if (!parent) {
				throw new ResourceNotFoundError(errorMessages(res).categoryNotFound);
			}

			const category = await productCategoryRepository.createCategory({
				...req.body,
				parent,
			});

			res.status(200).json(new CustomResponse(true, "", { category }));
		}
	);

	getSubtree = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { rootId } = req.params;
			const root = await productCategoryRepository.findById(rootId);

			if (!root) {
				throw new ResourceNotFoundError(errorMessages(res).categoryNotFound);
			}

			const tree = await productCategoryRepository.findDescendantsTree(root);

			res.status(200).json(new CustomResponse(true, "", { tree }));
		}
	);

	getTree = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const tree = await productCategoryRepository.findTrees();
			res.status(200).json(new CustomResponse(true, "", { tree }));
		}
	);

	getCategory = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;
			const category = await productCategoryRepository.findById(id);

			if (!category) {
				throw new ResourceNotFoundError(errorMessages(res).categoryNotFound);
			}

			res.status(200).json(new CustomResponse(true, "", { category }));
		}
	);

	getChildren = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { parentId } = req.params;
			const category = await productCategoryRepository.findById(parentId);

			if (!category) {
				throw new ResourceNotFoundError(errorMessages(res).categoryNotFound);
			}

			const children = await productCategoryRepository.findDescendants(
				category
			);

			res.status(200).json(new CustomResponse(true, "", { children }));
		}
	);

	updateCategory = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;
			const category = await productCategoryRepository.findById(id);

			if (!category) {
				throw new ResourceNotFoundError(errorMessages(res).categoryNotFound);
			}

			const updated = await productCategoryRepository.updateCategory(
				category,
				req.body
			);
			console.log(updated);

			res.status(200).json(new CustomResponse(true, "", { category }));
		}
	);

	changeParent = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { childId } = req.params;
			const { parentId } = req.body;
			const category = await productCategoryRepository.findById(childId);
			const parent = await productCategoryRepository.findById(parentId);

			if (!category || !parent) {
				throw new ResourceNotFoundError(errorMessages(res).categoryNotFound);
			}

			category.parent = parent;
			await productCategoryRepository.save(category);

			res.status(200).json(new CustomResponse(true, "", { category }));
		}
	);

	deleteCategory = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;
			const category = await productCategoryRepository.findByIdWithParent(id);

			if (!category) {
				throw new ResourceNotFoundError(errorMessages(res).categoryNotFound);
			}

			const subtree = await productCategoryRepository.findDescendantsTree(
				category
			);

			for (const child of subtree.children) {
				child.parent = category.parent;
				await productCategoryRepository.save(child);
			}

			await productCategoryRepository.remove(category);

			res.status(200).json(new CustomResponse(true, "", {}));
		}
	);

	deleteSubtee = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { rootId } = req.params;
			const category = await productCategoryRepository.findById(rootId);

			if (!category) {
				throw new ResourceNotFoundError(errorMessages(res).categoryNotFound);
			}

			await productCategoryRepository.remove(category);

			res.status(200).json(new CustomResponse(true, "", {}));
		}
	);

	getRoot = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const root = await productCategoryRepository.findRoots();
			res.status(200).json(new CustomResponse(true, "", { root }));
		}
	);

	getLeaves = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const leaves = await productCategoryRepository.findLeaves();
			res.status(200).json(new CustomResponse(true, "", { leaves }));
		}
	);
}
