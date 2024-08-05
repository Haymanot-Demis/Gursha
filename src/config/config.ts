import dotenv from "dotenv";
import { generateOTP } from "../utils/otpGenerator";
dotenv.config();

const envVars = process.env;

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
} = envVars;

export const BASE_URL = envVars.BASE_URL;
export const SALT: number = +envVars.SALT;
export const JWT_SECRET = envVars.JWT_SECRET;
export const SESSION_SECRET = envVars.SESSION_SECRET;

export const {
	TWILIO_ACCOUNT_SID = "",
	TWILIO_AUTH_TOKEN = "",
	TWILIO_PHONE_NUMBER = "",
} = envVars;

export const SMS_API = envVars.SMS_API;
export const SMS_AID = envVars.SMS_AID;
export const SMS_KEY = envVars.SMS_KEY;

export const {
	GOOGLE_CLIENT_ID = "",
	GOOGLE_CLIENT_SECRET = "",
	GOOGLE_CALLBACK_URL,
} = envVars;

export const accessExpirationSeconds = +envVars.JWT_ACCESS_EXPIRATION;
export const refreshExpirationSeconds = +envVars.JWT_REFRESH_EXPIRATION;
export const resetPasswordExpirationSeconds =
	+envVars.RESET_PASSWORD_EXPIRATION;
export const verifyEmailOrPhoneNumberExpirationSeconds =
	+envVars.VERIFY_EMAIL_PHONE_EXPIRATION;

export const ENCRYPTION_KEY = envVars.ENCRYPTION_KEY;
