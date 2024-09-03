import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { IBranchManager } from "./branchManager.model.interface";
import User from "../user/user.model";
import Branch from "../branch/branch.model";

@Entity()
export default class BranchManager implements IBranchManager {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@OneToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn()
	user: User;

	@OneToOne(() => Branch, { onDelete: "CASCADE" })
	@JoinColumn()
	branch: Branch;

	@ManyToOne(() => User, { onDelete: "SET NULL" })
	createdBy: User;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
