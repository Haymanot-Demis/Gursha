import Base from "../baseModel/interface";

export default interface ITransaction extends Base {
	amount: number;
	recipientAccountNumber: string;
	senderAccountNumber: string;
	remark: string;
}
