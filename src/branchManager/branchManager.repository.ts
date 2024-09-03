import { create } from "ts-node";
import { appDataSource } from "../common/config/data-source";
import BranchManager from "./branchManager.model";
import User from "../user/user.model";
import Branch from "../branch/branch.model";

const branchManagerRepository = appDataSource
	.getRepository(BranchManager)
	.extend({
		async findByUserId(userId: string) {
			return this.findOne({
				where: { user: { id: userId } },
				relations: ["user"],
			});
		},
		async createBranchManager(user: User, branch: Branch) {
			const branchManager = new BranchManager();
			branchManager.user = user;
			branchManager.branch = branch;
			await this.save(branchManager);
			return branchManager;
		},
	});

export default branchManagerRepository;
