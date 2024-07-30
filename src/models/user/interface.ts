import { Role } from "../../config/constants";
import Base from "../baseModel/interface";

export default interface IUser extends Base {
	fullname: string;
	email: string;
	passwordHash: string;
	phoneNumber: string;
	isAccountLocked: boolean;
	isAccountActive: boolean;
	failedLoginAttempts: number;
	role: Role;
}
