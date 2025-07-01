const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');
const { protect, isAdmin, isOrganizerOrAdmin } = require('../middleware/authMiddleware');
const trackStreak = require("../middleware/trackStreak");
const User = require('../model/UserModel');

// 🔐 OAuth Routes
router.get('/github', (req, res, next) => {
  const redirectTo = req.query.redirectTo;
  const state = redirectTo ? Buffer.from(JSON.stringify({ redirectTo })).toString('base64') : undefined;
  passport.authenticate('github', { 
    scope: ['user:email'],
    state: state
  })(req, res, next);
});

router.get('/google', (req, res, next) => {
  const redirectTo = req.query.redirectTo;
  const state = redirectTo ? Buffer.from(JSON.stringify({ redirectTo })).toString('base64') : undefined;
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    state: state
  })(req, res, next);
});

router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/login',
  session: true,
}), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  // Get redirectTo from state parameter if present
  let redirectTo = null;
  if (req.query.state) {
    try {
      const stateData = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
      redirectTo = stateData.redirectTo;
    } catch (err) {
      console.warn('Failed to parse OAuth state:', err);
    }
  }
  
  const baseRedirectUrl = `http://localhost:5173/oauth-success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&_id=${user._id}`;
  const redirectUrl = redirectTo ? `${baseRedirectUrl}&redirectTo=${encodeURIComponent(redirectTo)}` : baseRedirectUrl;
  
  res.redirect(redirectUrl);
});

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: true,
}), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  
  // Get redirectTo from state parameter if present
  let redirectTo = null;
  if (req.query.state) {
    try {
      const stateData = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
      redirectTo = stateData.redirectTo;
    } catch (err) {
      console.warn('Failed to parse OAuth state:', err);
    }
  }
  
  const baseRedirectUrl = `http://localhost:5173/oauth-success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&_id=${user._id}`;
  const redirectUrl = redirectTo ? `${baseRedirectUrl}&redirectTo=${encodeURIComponent(redirectTo)}` : baseRedirectUrl;
  
  res.redirect(redirectUrl);
});

// ✉️ Auth
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// 🚪 Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('http://localhost:5173/');
    });
  });
});

// 👤 User Routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, isAdmin, userController.deleteUser);
router.patch('/:id/role', protect, isOrganizerOrAdmin, userController.changeUserRole);
router.put('/:id/password', protect, userController.changePassword);

// ✅ Get current user info (for session refresh)
router.get('/me', protect, userController.getMe);

// 🏢 Organization
router.post('/invite', protect, isOrganizerOrAdmin, userController.inviteToOrganization);
router.get('/me/organization', protect, userController.getMyOrganizationStatus);

// 🔥 Streak
router.get('/:id/streaks', protect, userController.getUserStreakData);
router.post("/streak", protect, trackStreak, (req, res) => {
  res.status(200).json({ message: "Streak tracked" });
});

// ✅ My Registered Hackathons (IDs only)
router.get('/me/registered-hackathons', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('registeredHackathonIds');
    res.json(user.registeredHackathonIds || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch registered hackathons" });
  }
});

// ✅ Save / Unsave Hackathon
router.post('/save-hackathon', protect, userController.saveHackathon);

// ✅ Get Saved Hackathons List (full populated data)
router.get('/me/saved-hackathons', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedHackathons');
    res.status(200).json(user.savedHackathons || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved hackathons" });
  }
});

module.exports = router;
