import { Request, Response } from "express";
import { catchAsync } from "../utils/asyncHandler";
import userRepository from "../repositories/user.repository";
import { BadRequest, ResourceNotFoundError } from "../utils/error";
import { BASE_URL } from "../config/config";
import { CustomResponse } from "../config/response";
import { appDataSource } from "../config/app.datasource";
import Transaction from "../models/transaction/model";

export default class TransactionController {
	// transfer money from one account to another
	transfer = catchAsync(async (req: Request, res: Response) => {
		// @ts-ignore
		const { accountNumber } = req.user;
		// @ts-ignore
		const { amount, recipientAccountNumber } = req.body;

		let response = await fetch(`${BASE_URL}?accountNumber=${accountNumber}`);
		const senderAccount = await response.json();
		response = await fetch(
			`${BASE_URL}?accountNumber=${recipientAccountNumber}`
		);
		const recipientAccount = await response.json();

		if (!senderAccount?.length) {
			throw new ResourceNotFoundError(
				`User with account number ${accountNumber} not found`
			);
		}

		if (!recipientAccount?.length) {
			throw new ResourceNotFoundError(
				`Recipient with account number ${recipientAccountNumber} not found`
			);
		}

		if (senderAccount[0].balance < amount) {
			throw new BadRequest("Insufficient balance");
		}

		console.log(senderAccount, recipientAccount);

		senderAccount[0].balance -= amount;
		recipientAccount[0].balance += amount;

		// update the balance
		const result1 = fetch(`${BASE_URL}/6`, {
			method: "PUT",
			body: JSON.stringify(senderAccount[0]),
			headers: { "Content-Type": "application/json" },
		});

		const result2 = await fetch(`${BASE_URL}/1`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(recipientAccount[0]),
		});

		// TODO: save the transaction
		const transactionRepository = appDataSource.getRepository(Transaction);
		const transaction = new Transaction();

		transaction.amount = amount;
		transaction.recipientAccountNumber = recipientAccountNumber;
		transaction.senderAccountNumber = accountNumber;
		transaction.remark = "Transfer";

		await transactionRepository.save(transaction);

		console.log(transaction);

		res
			.status(200)
			.json(new CustomResponse(true, "Transfer successful", { transaction }));
	});

	// get the balance of the user
	getBalance = catchAsync(async (req: Request, res: Response) => {
		// @ts-ignore
		const { accountNumber } = req.user;

		const response = await fetch(`${BASE_URL}?accountNumber=${accountNumber}`);
		const account = await response.json();

		if (!account?.length) {
			throw new ResourceNotFoundError(
				`User with account number ${accountNumber} not found`
			);
		}

		res.status(200).json(
			new CustomResponse(true, "Success fetched", {
				balance: account[0].balance,
			})
		);
	});
}
