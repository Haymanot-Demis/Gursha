import { add } from "winston";
import { appDataSource } from "../common/config/data-source";
import Product from "./product.model";
import Branch from "../branch/branch.model";
import BranchProdct from "./branchProduct.model";
import branchRepository from "../branch/branch.repository";
import { ResourceNotFoundError } from "../common/utils/error";
import { errorMessages } from "../common/utils/serverResponseMessages";

const productRepository = appDataSource.getRepository(Product).extend({
	async createProduct({
		name,
		price,
		category,
		pictures,
		business,
	}): Promise<Product> {
		const product = new Product();
		product.name = name;
		product.price = price;
		product.category = category;
		product.business = business;
		product.pictures = pictures;
		return this.save(product);
	},
	async updateProduct({
		product,
		name,
		pictures,
		price,
		category,
	}): Promise<Product> {
		product.name = name;
		product.price = price;
		product.pictures = pictures;
		product.category = category;
		return this.save(product);
	},
	async addProductToBranches(
		product: Product,
		branches: Branch[]
	): Promise<BranchProdct[]> {
		const branchProducts = branches.map(async (branch) => {
			const branchProduct = new BranchProdct();
			branchProduct.product = product;
			branchProduct.branch = branch;
			return branchProduct;
		});
		return this.save(branchProducts);
	},
	async findById(id: string): Promise<Product> {
		return this.findOne({ where: { id } });
	},
	async findByBusinessId(businessId: string): Promise<Product[]> {
		return this.find({ where: { businessId } });
	},
	async removeAllProducts(businessId: string): Promise<void> {
		this.delete({ businessId });
	},
});

export default productRepository;
