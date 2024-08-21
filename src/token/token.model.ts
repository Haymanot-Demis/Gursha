import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import User from "../user/user.model";
import IToken from "./token.model.interface";
import { TokenTypes } from "../common/config/constants";

@Entity()
export default class Token implements IToken {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 255 })
	token: string;

	@Column()
	expirationDate: Date;

	@ManyToOne(() => User, { onDelete: "CASCADE" })
	user: User;

	@Column({
		type: "enum",
		enum: TokenTypes,
		default: TokenTypes.VERIFY_EMAIL_TOKEN,
	})
	type: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
