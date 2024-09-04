import { appDataSource } from "../common/config/data-source";
import Business from "./business.model";

const businessRepository = appDataSource.getRepository(Business).extend({
	async findByUserId(userId: string): Promise<Business> {
		return this.findOne({
			where: { user: { id: userId } },
			relations: ["user"],
		});
	},
	async updateBusiness(business: Business, data: any): Promise<Business> {
		Object.keys(data).forEach((key) => {
			business[key] = data[key];
		});

		return this.save(business);
	},
});

export default businessRepository;
