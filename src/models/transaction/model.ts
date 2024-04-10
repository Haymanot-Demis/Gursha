import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import ITransaction from "./interface";

@Entity()
export default class Transaction implements ITransaction {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	amount: number;

	@Column()
	recipientAccountNumber: string;

	@Column()
	senderAccountNumber: string;

	@Column()
	remark: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
