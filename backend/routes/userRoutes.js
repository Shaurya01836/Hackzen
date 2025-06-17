const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public Routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

// Protected Routes
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, isAdmin, userController.deleteUser);

// Auth & Registration
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

module.exports = router;
