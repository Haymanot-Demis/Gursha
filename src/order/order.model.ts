import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

import Base from "../common/models/base.interface";
import User from "../user/user.model";
import OrderItem from "./orderItem.model";

@Entity()
export default class Order implements Base {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@OneToMany(() => OrderItem, (orderItem) => orderItem.order)
	orderItems: OrderItem[];

	@ManyToOne(() => User)
	customer: User;

	@Column()
	totalPrice: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
