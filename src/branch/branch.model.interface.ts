import { OneToOne } from "typeorm";
import Base from "../common/models/base.interface";
import Businees from "../business/business.model";
import { IBusiness } from "../business/business.model.interface";
import IUser from "../user/user.model.interface";

export interface IBranch extends Base {
	name: string;
	address: string;
	business: IBusiness;
	createdBy: IUser;
}
