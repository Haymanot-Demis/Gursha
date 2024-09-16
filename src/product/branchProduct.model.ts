import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import Base from "../common/models/base.interface";
import Product from "./product.model";
import Branch from "../branch/branch.model";

@Entity()
export default class BranchProdct implements Base {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@PrimaryColumn()
	productId: string;

	@PrimaryColumn()
	branchId: string;

	@ManyToOne(() => Product, { onDelete: "CASCADE" })
	product: Product;

	@ManyToOne(() => Branch, { onDelete: "CASCADE" })
	branch: Branch;

	@Column()
	stockAmount: number;

	@Column()
	price: number;

	@Column({ default: true })
	isAvailable: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
