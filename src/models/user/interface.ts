import { Role } from "../../config/constants";
import Base from "../baseModel/interface";

export default interface IUser extends Base {
	firstname: string;
	lastname: string;
	email: string;
	passwordHash: string;
	phoneNumber: string;
	isAccountLocked: boolean;
	isAccountActive: boolean;
	failedLoginAttempts: number;
	role: Role;
}
