import { appDataSource } from "../common/config/data-source";
import Token from "./token.model";

const tokenRepository = appDataSource.getRepository(Token).extend({});

export default tokenRepository;
