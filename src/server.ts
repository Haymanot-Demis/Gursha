import app from "./app";
import { APP_PORT, NGROK_AUTH_TOKEN } from "./common/config/config";
import { appDataSource } from "./common/config/data-source";

console.log("NGROK_AUTH_TOKEN", NGROK_AUTH_TOKEN);

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
