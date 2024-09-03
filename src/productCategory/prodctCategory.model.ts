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

import Base from "../common/models/base.interface";

@Entity()
export default class ProductCategory implements Base {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 255, nullable: false, unique: true })
	name: string;

	@Column({ nullable: true })
	description: string;

	@OneToOne(() => ProductCategory, { onDelete: "CASCADE", nullable: true })
	@JoinColumn()
	parent: ProductCategory;

	@OneToMany(() => ProductCategory, (category) => category.parent)
	children: ProductCategory[];

	@Column()
	isLeaf: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
