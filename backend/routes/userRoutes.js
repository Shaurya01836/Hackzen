const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');
const { protect, isAdmin, isOrganizerOrAdmin } = require('../middleware/authMiddleware');
const trackStreak = require("../middleware/trackStreak");

// OAuth: GitHub & Google
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/login',
  session: true,
}), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const redirectUrl = `http://localhost:5173/oauth-success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&_id=${user._id}`;
  res.redirect(redirectUrl);
});

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: true,
}), (req, res) => {
  const user = req.user;
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const redirectUrl = `http://localhost:5173/oauth-success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&_id=${user._id}`;
  res.redirect(redirectUrl);
});

// Email/Password Auth
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('http://localhost:5173/');
    });
  });
});

// User CRUD
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, isAdmin, userController.deleteUser);
router.patch('/:id/role', protect, isOrganizerOrAdmin, userController.changeUserRole);
router.put('/:id/password', protect, userController.changePassword);


// ✅ Organization Features
router.post('/invite', protect, isOrganizerOrAdmin, userController.inviteToOrganization);
router.get('/me/organization', protect, userController.getMyOrganizationStatus);
router.get('/:id/streaks', protect, userController.getUserStreakData);
router.post("/streak", protect, trackStreak, (req, res) => {
  res.status(200).json({ message: "Streak tracked" });
});
// ✅ GET registered hackathon IDs for current user
router.get('/me/registered-hackathons', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('registeredHackathonIds');
    res.json(user.registeredHackathonIds || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch registered hackathons" });
  }
});


module.exports = router;
