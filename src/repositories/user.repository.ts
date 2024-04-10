import { appDataSource } from "../config/app.datasource";
import User from "../models/user/model";

const userRepository = appDataSource.getRepository(User).extend({});

export default userRepository;
