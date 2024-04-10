import { Entity, ManyToOne, OneToOne } from "typeorm";
import IUser from "./interface";
import { Column } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { CreateDateColumn } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { Role } from "../../config/constants";

@Entity()
export default class User implements IUser {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	accountNumber: string;

	@Column()
	passwordHash: string;

	@Column({ nullable: true })
	deviceCodeHash: string;

	@Column({ nullable: true })
	secretKey: string;

	@Column({ default: false })
	isAccountLocked: boolean;

	@Column({ default: false })
	isAccountActive: boolean;

	@Column({ default: 0 })
	failedLoginAttempts: number;

	@Column({ type: "enum", enum: Role, default: Role.CUSTOMER })
	role: Role;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
