const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// GitHub OAuth Routes FIRST
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    session: true,
  }),
  (req, res) => {
    // Redirect after successful GitHub login
    res.redirect('http://localhost:5173/dashboard');
  }
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: true
  }),
  (req, res) => {
    res.redirect('http://localhost:5173/dashboard'); // or your frontend route
  }
);

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/', userController.getAllUsers);

router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, isAdmin, userController.deleteUser);
router.patch('/:id/role', protect, isAdmin, userController.changeUserRole); // ✅ new
router.get('/:id', userController.getUserById); // 🟡 Keep this last

module.exports = router;
