const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// GitHub OAuth Routes FIRST
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

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

// Public Routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/', userController.getAllUsers);

// Protected Routes
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, isAdmin, userController.deleteUser);
router.get('/:id', userController.getUserById); // 🟡 Dynamic route LAST

module.exports = router;
