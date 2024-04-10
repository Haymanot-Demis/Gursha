import cryptoJs from "crypto-js";
import { ENCRYPTION_KEY } from "../config/config";

const encrypt = (data: string) => {
	return cryptoJs.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

const decrypt = (data: string) => {
	const bytes = cryptoJs.AES.decrypt(data, ENCRYPTION_KEY);
	const encryptedData = bytes.toString(cryptoJs.enc.Utf8);
	return JSON.parse(encryptedData);
};

const generateSecretKey = () => {
	return cryptoJs.lib.WordArray.random(16).toString();
};

export { encrypt, decrypt, generateSecretKey };
