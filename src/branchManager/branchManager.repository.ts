import { create } from "ts-node";
import { appDataSource } from "../common/config/data-source";
import BranchManager from "./branchManager.model";
import User from "../user/user.model";
import Branch from "../branch/branch.model";

const branchManagerRepository = appDataSource
	.getRepository(BranchManager)
	.extend({
		async findById(branchManagerId: string): Promise<BranchManager> {
			return this.findOne({
				where: { id: branchManagerId },
				relations: ["user", "branch"],
			});
		},
		async findByUserId(userId: string): Promise<BranchManager> {
			return this.findOne({
				where: { user: { id: userId } },
				relations: ["user", "branch"],
			});
		},
		async findByBranchId(branchId: string): Promise<BranchManager> {
			return this.findOne({
				where: { branch: { id: branchId } },
				relations: ["user", "branch"],
			});
		},
		async findByBusiness(businessId: string): Promise<BranchManager[]> {
			return this.find({
				where: { branch: { business: { id: businessId } } },
				relations: ["user", "branch"],
			});
		},
		async createBranchManager(user: User, branch: Branch, createdBy: User) {
			const branchManager = new BranchManager();
			branchManager.user = user;
			branchManager.branch = branch;
			branchManager.createdBy = createdBy;
			await this.save(branchManager);
			return branchManager;
		},
	});

export default branchManagerRepository;
