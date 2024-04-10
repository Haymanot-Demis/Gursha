import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import IVerificationCode from "./interface";
import User from "../user/model";

@Entity()
export default class VerificationCode implements IVerificationCode {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	code: string;

	@Column()
	expirationDate: Date;

	@OneToOne(() => User)
	@JoinColumn()
	user: User;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
