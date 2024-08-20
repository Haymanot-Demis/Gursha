import { createLogger, format, transports } from "winston";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = "logs";

// Create the log directory if it does not exist
if (!require("fs").existsSync(logDir)) {
	require("fs").mkdirSync(logDir);
}

export default createLogger({
	transports: [
		new transports.Console({
			level: "info",
			format: format.combine(
				format.colorize(),
				format.timestamp(),
				format.json()
			),
		}),
		new DailyRotateFile({
			filename: `${logDir}/%DATE%.log`,
			level: "info",
			datePattern: "YYYY-MM-DD",
			format: format.combine(format.timestamp(), format.json()),
		}),
	],
});
