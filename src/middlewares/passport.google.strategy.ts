import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as envVars from "./../config/config";
import userRepository from "../repositories/user.repository";
import User from "../models/user/model";

const googleStrategy = new GoogleStrategy(
	{
		clientID: envVars.GOOGLE_CLIENT_ID,
		clientSecret: envVars.GOOGLE_CLIENT_SECRET,
		callbackURL: envVars.GOOGLE_CALLBACK_URL,
	},
	async (accessToken, refreshToken, profile, done) => {
		// Save the user to the database
		console.log("accessToken", accessToken);
		console.log("refreshToken", refreshToken);
		console.log("profile", profile);
		var user: User | undefined;
		try {
			user = await userRepository.findOne({
				where: { email: profile.emails.values[0] },
			});
		} catch (err) {
			return done(err, user);
		}
		return done(null, user);
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
