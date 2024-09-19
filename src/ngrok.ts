// Require ngrok javascript sdk
const ngrok = require("@ngrok/ngrok");
// import ngrok from '@ngrok/ngrok' // if inside a module
import { NGROK_AUTH_TOKEN } from "./common/config/config";

(async function () {
	// Establish connectivity
	const listener = await ngrok.forward({
		addr: 3300,
		authtoken: NGROK_AUTH_TOKEN,
	});

	// Output ngrok url to console
	console.log(`Service established at: ${listener.url()}`);
})();

process.stdin.resume();
