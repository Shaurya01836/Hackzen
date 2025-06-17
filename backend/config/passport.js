const passport = require('passport');

const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../model/UserModel');

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubUsername: profile.username });

        if (!user) {
          user = await User.create({
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
            githubUsername: profile.username,
            profileImage: profile.photos?.[0]?.value || '',
            authProvider: 'github',
            passwordHash: '', // Empty since it's OAuth
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Required for sessions
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user)).catch(done);
});
