import { Entity } from "typeorm";
import Base from "../common/models/base.interface";
import { IBranch } from "../branch/branch.model.interface";
import IUser from "../user/user.model.interface";

export interface IBusiness extends Base {
	name: string;
	address: string;
	businessPhone: string;
	businessEmail: string;
	website: string;
	branches: IBranch[];
	description: string;
	postalCode: string;
	TINNumber: string;
	BusinessSector: string;
	isVerified: boolean;
	user: IUser;
}
