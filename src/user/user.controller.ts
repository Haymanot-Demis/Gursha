import { CustomResponse } from "../common/config/response";
import userRepository from "./../user/user.repository";
import { catchAsync } from "../common/utils/asyncHandler";
import { ResourceNotFoundError } from "../common/utils/error";
import {
	Request,
	Response,
	NextFunction,
} from "../common/config/extended.express";
import {
	errorMessages,
	successMessages,
} from "../common/utils/serverResponseMessages";

export default class UserController {
	updateProfile = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { user } = req;
			const userProfile = await userRepository.findOne({
				where: { id: user.id },
			});

			if (!userProfile) {
				throw new ResourceNotFoundError(errorMessages(res).userNotFound);
			}

			const { firstName, lastName } = req.body;

			userProfile.firstName = firstName;
			userProfile.lastName = lastName;

			await userRepository.save(userProfile);

			userProfile.passwordHash = undefined;

			res.status(200).json(
				new CustomResponse(true, successMessages(res).updateProfileSuccessful, {
					user: userProfile,
				})
			);
		}
	);
}
