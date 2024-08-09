import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as envVars from "./../config/config";
import userRepository from "../repositories/user.repository";
import User from "../models/user/model";

const googleStrategy = new GoogleStrategy(
	{
		clientID: envVars.GOOGLE_CLIENT_ID,
		clientSecret: envVars.GOOGLE_CLIENT_SECRET,
		callbackURL: envVars.GOOGLE_CALLBACK_URL,
		scope: [
			"profile",
			"email",
			"https://www.googleapis.com/auth/contacts.readonly",
		],
	},
	async (accessToken, refreshToken, profile, done) => {
		console.log("profile", profile);

		var user: User | undefined;
		try {
			user = await userRepository.findOne({
				where: { email: profile._json.email },
			});

			if (user) {
				console.log("user found", user);
				user.passwordHash = undefined;

				return done(null, user);
			}

			user = new User();
			user.email = profile._json.email;
			user.fullname = profile._json.name;
			user.phoneNumber = profile._json.sub;
			await userRepository.save(user);
			console.log("done with user", user);
			user.passwordHash = undefined;

			return done(null, user);
		} catch (err) {
			console.log("Error finding user", err);
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
