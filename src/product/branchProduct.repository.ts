import { appDataSource } from "../common/config/data-source";
import BranchProdct from "./branchProduct.model";

const branchProductRepository = appDataSource
	.getRepository(BranchProdct)
	.extend({
		async addProductToBranch({
			branchId,
			productId,
			stockAmount,
			price,
		}): Promise<BranchProdct> {
			const branchProduct = new BranchProdct();
			branchProduct.branchId = branchId;
			branchProduct.productId = productId;
			branchProduct.stockAmount = stockAmount;
			branchProduct.price = price;
			return this.save(branchProduct);
		},
		async updateBranchProduct({
			branchProduct,
			stockAmount,
			price,
		}): Promise<BranchProdct> {
			branchProduct.stockAmount = stockAmount;
			branchProduct.price = price;
			return this.save(branchProduct);
		},
		async findByBranchIdAndProdId(
			branchId: string,
			productId: string
		): Promise<BranchProdct> {
			return this.findOne({ where: { branchId, productId } });
		},
		async findByBranchId(branchId: string): Promise<BranchProdct[]> {
			return this.find({ where: { branchId } });
		},
	});

export default branchProductRepository;
