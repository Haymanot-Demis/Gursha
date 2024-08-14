import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import expressSession from "express-session";
import cors from "cors";
import {
	googleStrategy,
	serializeUser,
	deserializeUser,
} from "./common/middlewares/passport.google.strategy";
import rateLimiterMiddleware from "./common/middlewares/rateLimiter";

import routes from "./routes";

import { errorHandler } from "./common/middlewares/errorHandler";
import { CORS_ORIGINS, SESSION_SECRET } from "./common/config/config";

const app = express();

app.use(rateLimiterMiddleware);
app.use(
	cors({
		origin: CORS_ORIGINS,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	expressSession({
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

passport.use(googleStrategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", routes);
app.use(errorHandler);

export default app;
