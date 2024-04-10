import Base from "../baseModel/interface";
import IUser from "../user/interface";

export default interface IVerificationCode extends Base {
	code: string;
	expirationDate: Date;
	user: IUser;
}
