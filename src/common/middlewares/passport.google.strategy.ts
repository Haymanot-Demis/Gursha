import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as envVars from "../config/config";
import userRepository from "../../user/user.repository";
import User from "../../user/user.model";
import { bcryptHash } from "../utils/auth";
import { DEFAULT_PASSWORD } from "../config/config";
import logger from "./logger";

const googleStrategy = new GoogleStrategy(
	{
		clientID: envVars.GOOGLE_CLIENT_ID,
		clientSecret: envVars.GOOGLE_CLIENT_SECRET,
		callbackURL: envVars.GOOGLE_CALLBACK_URL,
	},
	async (accessToken, refreshToken, profile, done) => {
		logger.info("profile");

		var user: User | undefined;
		try {
			user = await userRepository.findOne({
				where: { email: profile._json.email },
			});

			if (user) {
				logger.info("user found");
				user.passwordHash = undefined;

				return done(null, user);
			}

			user = new User();
			user.email = profile._json.email;
			user.firstName = profile._json.given_name;
			user.lastName = profile._json.family_name;
			user.phoneNumber = profile._json.sub;
			user.passwordHash = await bcryptHash(DEFAULT_PASSWORD);
			user.isEmailVerified = profile._json.email_verified;
			await userRepository.save(user);
			user.passwordHash = undefined;

			return done(null, user);
		} catch (err) {
			return done(err, null);
		}
	}
);

const serializeUser = (user: User, done: any) => {
	done(null, user.id);
};

const deserializeUser = (id: string, done: any) => {
	userRepository
		.findOne({ where: { id } })
		.then((user) => {
			return done(null, user);
		})
		.catch((err) => done(err, null));
};

export { googleStrategy, serializeUser, deserializeUser };
