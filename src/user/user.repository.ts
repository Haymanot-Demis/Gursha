import { DEFAULT_PASSWORD } from "../common/config/config";
import { Role } from "../common/config/constants";
import { appDataSource } from "../common/config/data-source";
import { bcryptHash } from "../common/utils/auth";
import User from "./user.model";

const userRepository = appDataSource.getRepository(User).extend({
	async findUserByEmail(email: string): Promise<User> {
		return this.findOne({ where: { email } });
	},
	async findUserById(id: string): Promise<User> {
		return this.findOne({ where: { id } });
	},
	async createUser({
		firstName,
		lastName,
		email,
		password,
		role,
	}): Promise<User> {
		const user = new User();
		user.firstName = firstName;
		user.lastName = lastName;
		user.email = email;
		user.passwordHash = await bcryptHash(password);
		user.role = role;
		return user;
	},
	async createSalesUserAccount(data: any) {
		const user = await this.createUser({
			...data,
			password: DEFAULT_PASSWORD,
			role: Role.SALES,
		});

		user.isEmailVerified = true;
		await this.save(user);
		return user;
	},
	async createBranchManagerUserAccount(data: any) {
		const user = await this.createUser({
			...data,
			password: DEFAULT_PASSWORD,
			role: Role.BRANCH_MANAGER,
		});

		user.isEmailVerified = true;
		await this.save(user);
		return user;
	},
	async createCustomerSupportUserAccount(data: any) {
		const user = await this.createUser({
			...data,
			password: DEFAULT_PASSWORD,
			role: Role.CUSTOMER_SUPPORT,
		});

		user.isEmailVerified = true;
		await this.save(user);

		return user;
	},
});

export default userRepository;
