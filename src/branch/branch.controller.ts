import { EntityManager } from "typeorm";
import BranchManager from "../branchManager/branchManager.model";
import branchManagerRepository from "../branchManager/branchManager.repository";
import { appDataSource } from "../common/config/data-source";
import {
	Request,
	Response,
	NextFunction,
} from "../common/config/extended.express";
import { catchAsync } from "../common/utils/asyncHandler";
import User from "../user/user.model";
import userRepository from "../user/user.repository";
import Branch from "./branch.model";
import branchRepository from "./branch.repository";
import { CustomResponse } from "../common/config/response";
import { ResourceNotFoundError } from "../common/utils/error";
import { errorMessages } from "../common/utils/serverResponseMessages";
import businessRepository from "../business/business.respository";

export default class BranchController {
	getAll = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			const branches = await branchRepository.findByBusinessId(business.id);

			res.status(200).json(new CustomResponse(true, "", { branches }));
		}
	);

	getOneById = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { branchId } = req.params;
			const branch = await branchRepository.findById(branchId);

			if (!branch) {
				throw new ResourceNotFoundError(errorMessages(res).branchNotFound);
			}

			res.status(200).json(new CustomResponse(true, "", { branch }));
		}
	);

	create = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user;
			const businessOwner = await userRepository.findUserById(id);

			if (!businessOwner) {
				throw new ResourceNotFoundError(errorMessages(res).userNotFound);
			}

			const business = await businessRepository.findByUserId(id);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			const branch = await branchRepository.createBranch({
				...req.body,
				business,
				createdBy: businessOwner,
			});

			await branchRepository.save(branch);

			res
				.status(200)
				.json(new CustomResponse(true, "Branch created", { branch }));
		}
	);

	update = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { branchId } = req.params;
			const { name, address } = req.body;

			const branch = await branchRepository.findById(branchId);

			if (!branch) {
				throw new ResourceNotFoundError(errorMessages(res).branchNotFound);
			}

			branch.name = name;
			branch.address = address;

			await branchRepository.save(branch);

			res.status(200).json(new CustomResponse(true, "Branch updated", branch));
		}
	);

	delete = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { branchId } = req.params;
			const branch = await branchRepository.findById(branchId);

			if (!branch) {
				throw new ResourceNotFoundError(errorMessages(res).branchNotFound);
			}

			await branchRepository.remove(branch);

			res.status(200).json();
		}
	);
}
