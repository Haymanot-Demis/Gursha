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

	@Column({ nullable: false })
	fullname: string;

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

	@Column({ enum: Role, default: Role.CLIENT })
	role: Role;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
