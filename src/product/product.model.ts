import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import Base from "../common/models/base.interface";
import ProductCategory from "../productCategory/productCategory.model";
import Business from "../business/business.model";

@Entity()
export default class Product implements Base {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 255, nullable: false, unique: true })
	name: string;

	@Column()
	price: number;

	@ManyToOne(() => ProductCategory, { onDelete: "SET NULL" })
	category: ProductCategory;

	@ManyToOne(() => Business, (business) => business.products, {
		onDelete: "CASCADE",
	})
	business: Business;

	@Column({ type: "simple-array" })
	pictures: string[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
