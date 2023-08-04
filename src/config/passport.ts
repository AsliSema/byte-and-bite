import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import { config } from './config';
import User from '../models/user'

const GoogleStrategy = passportGoogle.Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackUrl,
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = await User.findOne({ email: profile.emails?.[0].value });
            // If user doesn't exist creates a new user. (similar to sign up)
            if (!user) {
                const newUser = await User.create({
                    email: profile.emails?.shift().value,
                    firstname: profile.name?.givenName,
                    lastname: profile.name.familyName || '.',
                    profileImage: profile.photos?.shift().value,
                });
                if (newUser) {
                    done(null, newUser);
                }
            } else {
                done(null, user);
            }
        }
    )
);