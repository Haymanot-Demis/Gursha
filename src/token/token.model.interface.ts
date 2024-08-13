import Base from "../common/models/base.interface";
import IUser from "../user/user.model.interface";

export default interface IToken extends Base {
	token: string;
	expirationDate: Date;
	user: IUser;
}
