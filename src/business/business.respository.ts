import { appDataSource } from "../common/config/data-source";
import Business from "./business.model";

const businessRepository = appDataSource.getRepository(Business).extend({
	async findByUserId(userId: string) {
		return this.findOne({
			where: { user: { id: userId } },
			relations: ["user"],
		});
	},
});

export default businessRepository;
