import Branch from "../branch/branch.model";
import { appDataSource } from "../common/config/data-source";
import User from "../user/user.model";
import CustomerSupport from "./customerSupport.model";

const customerSupportRepository = appDataSource
	.getRepository(CustomerSupport)
	.extend({
		async findById(id: string): Promise<CustomerSupport> {
			return this.findOne({ where: { id } });
		},
		async createCustomerSupport(user: User, createdBy: User, branch: Branch) {
			const customerSupport = new CustomerSupport();
			customerSupport.user = user;
			customerSupport.createdBy = createdBy;
			customerSupport.branch = branch;
			await this.save(customerSupport);
			return customerSupport;
		},
	});

export default customerSupportRepository;
