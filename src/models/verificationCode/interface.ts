import Base from "../baseModel/interface";
import IUser from "../user/interface";

export default interface IToken extends Base {
	token: string;
	expirationDate: Date;
	user: IUser;
}
