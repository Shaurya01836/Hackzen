const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const trackStreak = require("../middleware/trackStreak");
// OAuth Initiation

router.get('/github', passport.authenticate('github', {
  scope: ['user:email'],
}));

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// ============================
// 🔄 OAuth Callback Handlers
// ============================

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    session: true,
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const redirectUrl = `http://localhost:5173/oauth-success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&_id=${user._id}`;
    res.redirect(redirectUrl);
  }
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true,
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    const redirectUrl = `http://localhost:5173/oauth-success?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&_id=${user._id}`;
    res.redirect(redirectUrl);
  }
);

// ============================
// 🔐 Email/Password Auth
// ============================

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// ============================
// 🚪 Logout (OAuth Session Clear)
// ============================

router.get('/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('http://localhost:5173/');
    });
  });
});

router.get('/track', protect, trackStreak, (req, res) => {
  res.json({ message: 'Streak tracked successfully' });
});


// ============================
// 👤 User Management
// ============================

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, isAdmin, userController.deleteUser);
router.patch('/:id/role', protect, isAdmin, userController.changeUserRole);
router.put('/:id/password', protect, userController.changePassword);
router.get('/:id/streaks', protect, userController.getStreakStats);



module.exports = router;
