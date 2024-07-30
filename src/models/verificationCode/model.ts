import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import User from "../user/model";
import IToken from "./interface";
import { TokenTypes } from "../../config/constants";

@Entity()
export default class Token implements IToken {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	token: string;

	@Column()
	expirationDate: Date;

	@ManyToOne(() => User, { onDelete: "CASCADE" })
	user: User;

	@Column({ enum: TokenTypes, default: TokenTypes.VERIFY_EMAIL_TOKEN })
	type: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
