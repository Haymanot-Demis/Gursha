import { appDataSource } from "../common/config/data-source";
import Branch from "./branch.model";

const branchRepository = appDataSource.getRepository(Branch).extend({
	async findByName(name: string) {
		return this.findOne({ where: { name } });
	},
	async findById(id: string) {
		return this.findOne({ where: { id } });
	},
	async findByBusinessId(businessId: string) {
		return this.findOne({ where: { business: { id: businessId } } });
	},
	async createBranch({ name, address, business }) {
		const branch = new Branch();
		branch.name = name;
		branch.address = address;
		branch.business = business;
		await this.save(branch);
		return branch;
	},
});

export default branchRepository;
