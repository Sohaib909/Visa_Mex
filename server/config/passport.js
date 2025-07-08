const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// Ensure environment variables are loaded
require('dotenv').config();

// Debug: Log environment variables 
console.log(' Debug - Environment Variables:');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Found' : 'Missing');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Found' : 'Missing');
console.log('FACEBOOK_APP_ID:', process.env.FACEBOOK_APP_ID ? 'Found' : 'Missing');
console.log('FACEBOOK_APP_SECRET:', process.env.FACEBOOK_APP_SECRET ? 'Found' : 'Missing');

// Serialize user for session
passport.serializeUser((user, done) => {
  console.log('📝 Serializing user for session:', user._id);
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    console.log('📖 Deserializing user from session:', id);
    const user = await User.findById(id);
    if (user) {
      console.log('✅ User found during deserialization');
      done(null, user);
    } else {
      console.log('❌ User not found during deserialization');
      done(null, false);
    }
  } catch (error) {
    console.error('❌ Deserialization error:', error);
    done(error, null);
  }
});

// Google OAuth Strategy - Only initialize if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? `${process.env.BACKEND_URL}/api/auth/google/callback`
      : "http://localhost:5000/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with Google ID
      let existingUser = await User.findOne({ googleId: profile.id });
      
      if (existingUser) {
        return done(null, existingUser);
      }

      // Check if user exists with same email
      existingUser = await User.findOne({ email: profile.emails[0].value });
      
      if (existingUser) {
        // Link Google account to existing user
        existingUser.googleId = profile.id;
        existingUser.profilePicture = profile.photos[0]?.value;
        await existingUser.save();
        return done(null, existingUser);
      }

      // Create new user
      const newUser = await User.create({
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0]?.value,
        authProvider: 'google',
        isEmailVerified: true, 
        role: 'user' 
      });

      done(null, newUser);
    } catch (error) {
      done(error, null);
    }
  }));
} else {
  console.log('  Google OAuth not configured - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET not found in environment variables');
}

// Facebook OAuth Strategy - Only initialize if credentials are available
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
      ? `${process.env.BACKEND_URL}/api/auth/facebook/callback`
      : "http://localhost:5000/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'emails', 'picture.type(large)']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with Facebook ID
      let existingUser = await User.findOne({ facebookId: profile.id });
      
      if (existingUser) {
        return done(null, existingUser);
      }

      // Check if user exists with same email
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      if (email) {
        existingUser = await User.findOne({ email: email.toLowerCase() });
        
        if (existingUser) {
          // Link Facebook account to existing user
          existingUser.facebookId = profile.id;
          existingUser.profilePicture = profile.photos && profile.photos[0] ? profile.photos[0].value : undefined;
          existingUser.authProvider = 'facebook';
          await existingUser.save();
          return done(null, existingUser);
        }
      }

      // Create new user with Facebook OAuth
      const newUser = await User.create({
        facebookId: profile.id,
        firstName: profile.name?.givenName || profile.displayName?.split(' ')[0] || 'Facebook',
        lastName: profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || 'User',
        email: email ? email.toLowerCase() : `facebook.${profile.id}@placeholder.com`,
        profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
        authProvider: 'facebook',
        isEmailVerified: email ? true : false, // Facebook emails are pre-verified if available
        role: 'user' // Default role
      });

      done(null, newUser);
    } catch (error) {
      done(error, null);
    }
  }));
} else {
  console.log(' Facebook OAuth not configured - FACEBOOK_APP_ID and FACEBOOK_APP_SECRET not found in environment variables');
}

module.exports = passport; 