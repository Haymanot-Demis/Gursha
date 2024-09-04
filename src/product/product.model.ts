import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Base from "../common/models/base.interface";
import ProductCategory from "../productCategory/productCategory.model";

@Entity()
export default class Product implements Base {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 255, nullable: false, unique: true })
	name: string;

	@Column()
	price: number;

	@ManyToOne(() => ProductCategory)
	category: ProductCategory;

	createdAt: Date;
	updatedAt: Date;
}
