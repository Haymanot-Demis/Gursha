import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { IBusiness } from "./business.model.interface";
import Branch from "../branch/branch.model";
import User from "../user/user.model";

@Entity()
export default class Business implements IBusiness {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ nullable: false, unique: true })
	name: string;

	@Column({ nullable: true })
	address: string;

	@Column({ nullable: true })
	businessPhone: string;

	@Column({ nullable: true })
	businessEmail: string;

	@Column({ nullable: true })
	website: string;

	@Column({ nullable: true })
	bannerPhotoUrl: string;

	@OneToMany(() => Branch, (branch) => branch.business)
	branches: Branch[];

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	postalCode: string;

	@Column({ nullable: true })
	TINNumber: string;

	@Column({ nullable: true })
	BusinessSector: string;

	@Column({ default: false })
	isVerified: boolean;

	@OneToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn()
	user: User;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
