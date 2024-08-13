import { appDataSource } from "../common/config/data-source";
import User from "./user.model";

const userRepository = appDataSource.getRepository(User).extend({});

export default userRepository;
