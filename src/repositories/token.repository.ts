import { appDataSource } from "../config/app.datasource";
import Token from "../models/verificationCode/model";
import VerificationCode from "../models/verificationCode/model";

const tokenRepository = appDataSource.getRepository(Token).extend({});

export default tokenRepository;
