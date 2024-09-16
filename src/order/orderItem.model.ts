import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import Base from "../common/models/base.interface";
import Order from "./order.model";
import Product from "../product/product.model";
import BranchProdct from "../product/branchProduct.model";

@Entity()
export default class OrderItem implements Base {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Order, (order) => order.orderItems, { onDelete: "CASCADE" })
	order: Order;

	@ManyToOne(() => BranchProdct, { onDelete: "SET NULL" })
	product: BranchProdct;

	@Column()
	price: number;

	@Column()
	quantity: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
