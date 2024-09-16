import {
	Entity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
} from "typeorm";

import { IBranch } from "./branch.model.interface";
import Businees from "../business/business.model";
import User from "../user/user.model";
import CustomerSupport from "../customerSupport/customerSupport.model";

@Entity()
export default class Branch implements IBranch {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ nullable: false, unique: true })
	name: string;

	@Column({ nullable: false })
	address: string;

	@ManyToOne(() => Businees, (business) => business.branches, {
		onDelete: "CASCADE",
	})
	business: Businees;

	@ManyToOne(() => User, { onDelete: "SET NULL" })
	createdBy: User;

	@OneToMany(() => CustomerSupport, (customerSupport) => customerSupport.branch)
	customerSupports: CustomerSupport[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
