import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import Base from "../common/models/base.interface";
import User from "../user/user.model";
import Branch from "../branch/branch.model";

@Entity()
export default class CustomerSupport implements Base {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@OneToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn()
	user: User;

	@ManyToOne(() => Branch, { onDelete: "CASCADE" })
	branch: Branch;

	@ManyToOne(() => User, { onDelete: "SET NULL" })
	createdBy: User;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
