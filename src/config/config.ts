import dotenv from "dotenv";
dotenv.config();

export const {
	NODE_ENV = "development",
	APP_PORT = 5500,

	DB_PORT = "",
	DB_HOST = "",
	DB_USERNAME = "",
	DB_PASSWORD = "",
	DB_NAME = "",
	DB_URL = "",

	MAIL_HOST = "",
	MAIL_PASSWORD = "",
	MAIL_USERNAME = "",
	APP_ORIGIN = "http://localhost:" + APP_PORT,
} = process.env;

export const BASE_URL = process.env.BASE_URL;
export const SALT: number = +process.env.SALT;
export const JWT_SECRET = process.env.JWT_SECRET;

export const {
	TWILIO_ACCOUNT_SID = "",
	TWILIO_AUTH_TOKEN = "",
	TWILIO_PHONE_NUMBER = "",
} = process.env;

export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
