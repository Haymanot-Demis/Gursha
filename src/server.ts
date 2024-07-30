import app from "./app";
import { APP_PORT } from "./config/config";
import { appDataSource } from "./config/app.datasource";

const main = async () => {
	try {
		await appDataSource.initialize();

		app.listen(APP_PORT, () => {
			console.log(`Server is running on port ${APP_PORT}`);
		});
	} catch (err) {
		console.log("Error while starting the server", err);
	}
};

main();
