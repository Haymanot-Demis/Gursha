import Base from "../common/models/base.interface";
import { IBranch } from "../branch/branch.model.interface";
import IUser from "../user/user.model.interface";

export interface IBusiness extends Base {
	name: string;
	address: string;
	businessPhone: string;
	businessEmail: string;
	website: string;
	logoPhotoUrl: string;
	bannerPhotoUrl: string;
	branches: IBranch[];
	description: string;
	postalCode: string;
	TINNumber: string;
	BusinessSector: string;
	isReadyForReview: boolean;
	isVerified: boolean;
	user: IUser;
}
