import { CustomResponse } from "../config/response";
import userRepository from "../repositories/user.repository";
import { catchAsync } from "../utils/asyncHandler";
import { ResourceNotFoundError } from "../utils/error";
import { Request, Response, NextFunction } from "./../config/extended.express";

export default class UserController {
	updateProfile = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { user } = req;
			const userProfile = await userRepository.findOne({
				where: { id: user.id },
			});

			if (!userProfile) {
				throw new ResourceNotFoundError("User not found");
			}

			const { firstname, lastname } = req.body;

			userProfile.firstname = firstname;
			userProfile.lastname = lastname;

			await userRepository.save(userProfile);

			userProfile.passwordHash = undefined;

			res
				.status(200)
				.json(
					new CustomResponse(true, "Profile updated successfully", {
						user: userProfile,
					})
				);
		}
	);
}
