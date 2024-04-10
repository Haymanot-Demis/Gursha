import { appDataSource } from "../config/app.datasource";
import VerificationCode from "../models/verificationCode/model";

const verificationCodeRepository = appDataSource
	.getRepository(VerificationCode)
	.extend({});

export default verificationCodeRepository;
