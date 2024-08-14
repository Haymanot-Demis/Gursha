import { Role } from "../common/config/constants";
import Base from "../common/models/base.interface";

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
