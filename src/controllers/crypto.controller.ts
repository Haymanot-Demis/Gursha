import { Request, Response } from "express";
import { decrypt, encrypt } from "../utils/crypto";

export default class CryptoController {
	encrypt = async (req: Request, res: Response) => {
		const body = req.body;
		const encryptedData = encrypt(JSON.stringify(body));
		res.status(200).json({ encryptedData });
	};

	decrypt = async (req: Request, res: Response) => {
		const { data } = req.body;
		const decryptedData = decrypt(data);
		res.status(200).json({ decryptedData });
	};
}
