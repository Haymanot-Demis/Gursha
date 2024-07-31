import express, { NextFunction, Request, Response } from "express";

import routes from "./routes";

import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// decrypt the body data before passing it to the routes

// app.use((req: Request, res: Response, next: NextFunction) => {
// 	if (!req.path?.startsWith("/api/v1/crypto")) {
// 		const { data } = req.body;
// 		req.body = decrypt(data);
// 	}
// 	next();
// });
app.use("/api/v1", routes);
app.use(errorHandler);

export default app;
