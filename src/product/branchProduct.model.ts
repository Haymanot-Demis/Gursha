import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
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

	@ManyToOne(() => Product)
	product: Product;

	@ManyToOne(() => Branch)
	branch: Branch;

	@Column()
	stockAmount: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
