const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.NODE_ENV === 'production'?`${process.env.BACKEND_URL}/auth/google/callback`:'http://localhost:8000/auth/google/callback',
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        const existingEmailUser = await User.findOne({
          email: profile.emails[0].value,
        });

        if (existingEmailUser) {
          existingEmailUser.googleId = profile.id;
          existingEmailUser.authProvider = 'google';
          await existingEmailUser.save();
          return done(null, existingEmailUser);
        }

        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
          authProvider: 'google',
        });

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;