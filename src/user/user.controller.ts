import { CustomResponse } from "../common/config/response";
import userRepository from "./../user/user.repository";
import { catchAsync } from "../common/utils/asyncHandler";
import {
	ResourceAlreadyExistsError,
	ResourceNotFoundError,
} from "../common/utils/error";
import {
	Request,
	Response,
	NextFunction,
} from "../common/config/extended.express";
import {
	errorMessages,
	successMessages,
} from "../common/utils/serverResponseMessages";
import tokenRepository from "../token/token.repository";
import Token from "../token/token.model";
import { generateToken } from "../common/utils/otpGenerator";
import { Role, TokenTypes } from "../common/config/constants";
import { resetPasswordExpirationSeconds } from "../common/config/config";
import { sendPasswordResetEmail } from "../common/services/email.service";
import branchManagerRepository from "../branchManager/branchManager.repository";
import Branch from "../branch/branch.model";
import branchRepository from "../branch/branch.repository";
import businessRepository from "../business/business.respository";
import User from "./user.model";
import { custom } from "joi";
import customerSupportRepository from "../customerSupport/customerSupport.repository";
import { In } from "typeorm";

export default class UserController {
	getAll = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const users = await userRepository.find();

			res
				.status(200)
				.json(new CustomResponse(true, "Users fetched", { users }));
		}
	);

	getUserById = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;
			const user = await userRepository.findUserById(id);

			if (!user) {
				throw new ResourceNotFoundError(errorMessages(res).userNotFound);
			}

			user.passwordHash = undefined;

			res.status(200).json(new CustomResponse(true, "User fetched", { user }));
		}
	);

	getByRole = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { roles } = req.body;

			const users = await userRepository.find({ where: { role: In(roles) } });

			res.status(200).json(new CustomResponse(true, "", { users }));
		}
	);

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

	createSalesUserAccount = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const isExist = await userRepository.findUserByEmail(req.body.email);

			if (isExist) {
				throw new ResourceAlreadyExistsError(
					errorMessages(res).emailAlreadyExists
				);
			}

			const user = await userRepository.createSalesUserAccount(req.body);
			const token = generateToken(
				user,
				TokenTypes.RESET_PASSWORD_TOKEN,
				resetPasswordExpirationSeconds
			);

			await tokenRepository.save(token);

			await sendPasswordResetEmail(user, token);

			user.passwordHash = undefined;

			res.status(201).json(
				new CustomResponse(true, "Sales account created successfully", {
					user,
				})
			);
		}
	);

	createBranchManagerUserAccount = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const business = await businessRepository.findByUserId(id);

			if (!business) {
				throw new ResourceNotFoundError(errorMessages(res).businessNotFound);
			}

			const branch = await branchRepository.findById(req.body.branchId);

			if (!branch) {
				throw new ResourceNotFoundError(errorMessages(res).branchNotFound);
			}

			const isExist = await userRepository.findUserByEmail(req.body.email);

			if (isExist) {
				throw new ResourceAlreadyExistsError(
					errorMessages(res).emailAlreadyExists
				);
			}

			const user = await userRepository.createBranchManagerUserAccount(
				req.body
			);

			const branchManager = await branchManagerRepository.createBranchManager(
				user,
				branch,
				business.user
			);

			const token = generateToken(
				user,
				TokenTypes.RESET_PASSWORD_TOKEN,
				resetPasswordExpirationSeconds
			);

			await tokenRepository.save(token);

			const result = await sendPasswordResetEmail(user, token);

			branchManager.user.passwordHash = undefined;

			res.status(201).json(
				new CustomResponse(
					true,
					"Branch manager account created successfully",
					{
						branchManager,
					}
				)
			);
		}
	);

	createCustomerSupportUserAccount = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const creatorUser = await userRepository.findUserById(id);

			if (!creatorUser) {
				throw new ResourceNotFoundError(errorMessages(res).userNotFound);
			}

			const branch = await branchRepository.findById(req.body.branchId);

			if (!branch) {
				throw new ResourceNotFoundError(errorMessages(res).branchNotFound);
			}

			const isExist = await userRepository.findUserByEmail(req.body.email);

			if (isExist) {
				throw new ResourceAlreadyExistsError(
					errorMessages(res).emailAlreadyExists
				);
			}

			const user = await userRepository.createCustomerSupportUserAccount(
				req.body
			);

			const customerSupport =
				await customerSupportRepository.createCustomerSupport(
					user,
					creatorUser,
					branch
				);

			const token = generateToken(
				user,
				TokenTypes.RESET_PASSWORD_TOKEN,
				resetPasswordExpirationSeconds
			);

			await tokenRepository.save(token);

			const result = await sendPasswordResetEmail(user, token);
			console.log("result", result);

			user.passwordHash = undefined;

			res.status(201).json(
				new CustomResponse(
					true,
					"Customer support account created successfully",
					{
						customerSupport,
					}
				)
			);
		}
	);

	deleteUserAccount = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.user as User;
			const userProfile = await userRepository.findOne({
				where: { id },
			});

			if (!userProfile) {
				throw new ResourceNotFoundError(errorMessages(res).userNotFound);
			}

			await userRepository.delete(userProfile.id);

			res
				.status(200)
				.json(new CustomResponse(true, "User account deleted successfully"));
		}
	);

	deleteSalesUserAccount = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;
			const user = await userRepository.findOne({
				where: { id, role: Role.SALES },
			});

			if (!user) {
				throw new ResourceNotFoundError(errorMessages(res).userNotFound);
			}

			await userRepository.delete(user.id);

			res
				.status(200)
				.json(new CustomResponse(true, "Sales account deleted successfully"));
		}
	);

	deleteBranchManagerUserAccount = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;
			const user = await branchRepository.findById(id);

			if (!user) {
				throw new ResourceNotFoundError(errorMessages(res).userNotFound);
			}

			await userRepository.delete(user.id);

			res
				.status(200)
				.json(
					new CustomResponse(
						true,
						"Branch manager account deleted successfully"
					)
				);
		}
	);

	deleteCustomerSupportUserAccount = catchAsync(
		async (req: Request, res: Response, next: NextFunction) => {
			const { id } = req.params;
			const user = await customerSupportRepository.findById(id);

			if (!user) {
				throw new ResourceNotFoundError(errorMessages(res).userNotFound);
			}

			await userRepository.delete(user.id);

			res
				.status(200)
				.json(
					new CustomResponse(
						true,
						"Customer support account deleted successfully"
					)
				);
		}
	);
}
