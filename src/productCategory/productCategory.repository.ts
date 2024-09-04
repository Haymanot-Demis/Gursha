import { appDataSource } from "../common/config/data-source";
import ProductCategory from "./productCategory.model";

const productCategoryRepository = appDataSource
	.getTreeRepository(ProductCategory)
	.extend({
		async findById(id: string): Promise<ProductCategory> {
			return this.findOne({ where: { id } });
		},
		async findByIdWithParent(id: string): Promise<ProductCategory> {
			return this.findOne({ where: { id }, relations: ["parent"] });
		},
		async createCategory({
			name,
			description,
			parent,
		}): Promise<ProductCategory> {
			const category = new ProductCategory();
			category.name = name;
			category.description = description;
			category.parent = parent;
			return this.save(category);
		},
		async updateCategory(
			category: ProductCategory,
			{ name, description }
		): Promise<ProductCategory> {
			category.name = name;
			category.description = description;
			return this.save(category);
		},
		async findLeaves(): Promise<ProductCategory[]> {
			return this.createQueryBuilder("product_category")
				.leftJoinAndSelect("product_category.children", "children")
				.where("children.id IS NULL")
				.getMany();
		},
	});

export default productCategoryRepository;
