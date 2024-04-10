import { Role } from "../../config/constants";
import Base from "../baseModel/interface";

export default interface IUser extends Base {
	accountNumber: string;
	passwordHash: string;
	deviceCodeHash: string;
	isAccountLocked: boolean;
	isAccountActive: boolean;
	failedLoginAttempts: number;
	secretKey: string;
	role: Role;
}
