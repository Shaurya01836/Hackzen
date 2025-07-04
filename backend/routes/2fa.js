const express = require('express');
const router = express.Router();
const { generate2FA, verify2FA, login2FA, disable2FA } = require('../controllers/2faController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generate2FA);
router.post('/verify', protect, verify2FA);
router.post('/login', login2FA);
router.post('/disable', protect, disable2FA);

module.exports = router; 