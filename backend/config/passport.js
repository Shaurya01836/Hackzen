const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/UserModel');
const jwt = require('jsonwebtoken');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      passReqToCallback: true, // 👈 Required to access `req.query.state`
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const token = req.query.state; // JWT passed from frontend
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return done(null, false);

        user.githubUsername = profile.username;
        user.githubProfile = profile.profileUrl || `https://github.com/${profile.username}`;
        user.profileImage = user.profileImage || profile.photos?.[0]?.value || `https://github.com/${profile.username}.png`;

        await user.save();
        done(null, user);
      } catch (err) {
        console.error("GitHub linking error:", err.message);
        done(err, null);
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
