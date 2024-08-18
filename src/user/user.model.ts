import { Entity, ManyToOne, OneToOne } from "typeorm";
import IUser from "./user.model.interface";
import { Column } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { CreateDateColumn } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { Role } from "../common/config/constants";

@Entity()
export default class User implements IUser {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ nullable: false })
	firstName: string;

	@Column({ nullable: false })
	lastName: string;

	@Column({ nullable: true, unique: true })
	email: string;

	@Column({ nullable: false })
	passwordHash: string;

	@Column({ nullable: true, unique: true })
	phoneNumber: string;

	@Column({ default: false })
	isAccountLocked: boolean;

	@Column({ default: true })
	isAccountActive: boolean;

	@Column({ default: false })
	isEmailVerified: boolean;

	@Column({ default: 0 })
	failedLoginAttempts: number;

	@Column({ type: "enum", enum: Role, default: Role.CLIENT })
	role: Role;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
