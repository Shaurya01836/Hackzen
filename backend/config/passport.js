const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/UserModel');

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;

        // ✅ First: check if a user with this email already exists
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName || profile.username,  email,
            githubUsername: profile.username,
            profileImage: profile.photos?.[0]?.value || '',
            authProvider: 'github',
            passwordHash: '', // No password for OAuth
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);


// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            profileImage: profile.photos?.[0]?.value || '',
            authProvider: 'google',
            passwordHash: '',
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Session Handling
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user)).catch(done);
});
