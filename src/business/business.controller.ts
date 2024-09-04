import {
	Request,
	Response,
	NextFunction,
} from "../common/config/extended.express";
import { CustomResponse } from "../common/config/response";
import { catchAsync } from "../common/utils/asyncHandler";
import { ResourceNotFoundError } from "../common/utils/error";
import { errorMessages } from "../common/utils/serverResponseMessages";
import User from "../user/user.model";
import businessRepository from "./business.respository";

export default class BusinessController {
	// update, save or submit business infi
	// get business info
	getBusinessInfo = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				return next(
					new ResourceNotFoundError(errorMessages(res).businessNotFound)
				);
			}

			business.user.passwordHash = undefined;

			res
				.status(200)
				.json(new CustomResponse(true, "", { businessInfo: business }));
		}
	);

	updateBusinessInfo = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				return next(
					new ResourceNotFoundError(errorMessages(res).businessNotFound)
				);
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
}
