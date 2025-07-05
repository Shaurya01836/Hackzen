const express = require('express');
const router = express.Router();
const { 
  generate2FA, 
  verify2FA, 
  login2FA, 
  disable2FA, 
  get2FAStatus 
} = require('../controllers/2faController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes (require authentication)
router.post('/generate', protect, generate2FA);
router.post('/verify', protect, verify2FA);
router.post('/disable', protect, disable2FA);
router.get('/status', protect, get2FAStatus);

// Public route for 2FA login (no auth required)
router.post('/login', login2FA);

module.exports = router; 