import Base from "../common/models/base.interface";
import { IBranch } from "../branch/branch.model.interface";
import IUser from "../user/user.model.interface";

export interface IBranchManager extends Base {
	user: IUser;
	branch: IBranch;
	createdBy: IUser;
}
