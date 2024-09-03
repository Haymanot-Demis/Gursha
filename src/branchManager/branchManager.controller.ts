import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../common/utils/asyncHandler";
import User from "../user/user.model";
import businessRepository from "../business/business.respository";
import { ResourceNotFoundError } from "../common/utils/error";
import { errorMessages } from "../common/utils/serverResponseMessages";
import branchRepository from "../branch/branch.repository";
import branchManagerRepository from "./branchManager.repository";
import { CustomResponse } from "../common/config/response";

export default class BranchManagerController {
	getAllBMOfBusiness = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			const branchesManagers = await branchManagerRepository.findByBusiness(
				business.id
			);

			res.status(200).json(new CustomResponse(true, "", { branchesManagers }));
		}
	);

	getOneByBranchId = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { branchId } = req.params;
			const branch = await branchRepository.findById(branchId);

			if (!branch) {
				throw new ResourceNotFoundError(errorMessages(res).branchNotFound);
			}

			const branchManager = await branchManagerRepository.findByBranchId(
				branchId
			);

			res.status(200).json(new CustomResponse(true, "", { branchManager }));
		}
	);

	getOneById = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { branchManagerId } = req.params;
			const branchManager = await branchManagerRepository.findById(
				branchManagerId
			);

			if (!branchManager) {
				throw new ResourceNotFoundError(
					errorMessages(res).branchManagerNotFound
				);
			}

			res.status(200).json(new CustomResponse(true, "", { branchManager }));
		}
	);
}
