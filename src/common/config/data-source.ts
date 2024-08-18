import { DataSource } from "typeorm";
import {
	DB_URL,
	DB_HOST,
	DB_PASSWORD,
	DB_PORT,
	DB_USERNAME,
	DB_NAME,
} from "./config";

export const appDataSource: DataSource = new DataSource({
	type: "mysql",
	host: DB_HOST,
	port: +DB_PORT,
	username: DB_USERNAME,
	password: DB_PASSWORD,
	database: DB_NAME,
	// url: DB_URL,
	synchronize: true,
	logging: false,
	entities: ["src/**/*.model.ts"],
});
