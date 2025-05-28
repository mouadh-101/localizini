import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../models/index.js';
import * as authService from '../services/authService.js'; // For generating token

const { User } = db;

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
  console.warn('Google OAuth environment variables are not fully configured. Google login may not work. Make sure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL are set in your .env file.');
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'], // Define the scope of information requested
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // profile object contains user info from Google
      const { id: googleId, displayName: name, emails, photos } = profile;
      const email = emails && emails.length > 0 ? emails[0].value : null;
      const avatarUrl = photos && photos.length > 0 ? photos[0].value : null;

      if (!email) {
        return done(new Error('Email not provided by Google'), null);
      }

      let user = await User.findOne({ where: { email } });

      if (user) {
        // User exists with this email. Update googleId if not set.
        if (!user.googleId) {
          user.googleId = googleId;
          // Optionally update name/avatar if they signed up locally first
          user.name = user.name || name; 
          user.avatarUrl = user.avatarUrl || avatarUrl;
          await user.save();
        } else if (user.googleId !== googleId) {
          // Email exists but is associated with a different Google account.
          return done(new Error('Email is associated with a different Google account.'), null);
        }
      } else {
        // User does not exist, create a new one
        // Password can be null for OAuth-only users
        // discoveryStreak will use its default value from the model
        user = await User.create({ 
          googleId,
          email,
          name,
          avatarUrl,
        });
      }
      
      // Pass the user object to be available in the callback's req.user
      return done(null, user); 
    } catch (error) {
      return done(error, null);
    }
  }
));

// Passport session serialization/deserialization is not strictly needed
// if using JWTs and not traditional server sessions.
// However, passport requires them to be defined. They can be minimal if not used.
passport.serializeUser((user, done) => {
  done(null, user.id); 
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
