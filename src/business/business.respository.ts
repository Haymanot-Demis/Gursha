import { appDataSource } from "../common/config/data-source";
import Business from "./business.model";

const businessRepository = appDataSource.getRepository(Business).extend({
	async findById(id: string): Promise<Business> {
		return this.findOne({ where: { id } });
	},
	async findByUserId(userId: string): Promise<Business> {
		return this.findOne({
			where: { user: { id: userId } },
		});
	},
	async findReadyForReview(): Promise<Business[]> {
		return this.find({ where: { isReadyForReview: true } });
	},
	async updateBusiness(business: Business, data: any): Promise<Business> {
		Object.keys(data).forEach((key) => {
			business[key] = data[key];
		});

		return this.save(business);
	},
});

export default businessRepository;
