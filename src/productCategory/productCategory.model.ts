import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	Tree,
	TreeChildren,
	TreeParent,
	UpdateDateColumn,
} from "typeorm";

import Base from "../common/models/base.interface";

@Entity()
@Tree("closure-table")
export default class ProductCategory implements Base {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 255, nullable: false, unique: true })
	name: string;

	@Column({ default: "" })
	description: string;

	@TreeParent()
	parent: ProductCategory;

	@TreeChildren()
	children: ProductCategory[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
