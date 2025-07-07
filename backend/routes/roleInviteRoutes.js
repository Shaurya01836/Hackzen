const express = require('express');
const router = express.Router();
const teamInviteController = require('../controllers/teamInviteController');
const { protect } = require('../middleware/authMiddleware');

// Get role invite by token (no auth required for initial fetch)
router.get('/:token', teamInviteController.getRoleInviteByToken);

// Accept role invite (requires authentication)
router.post('/:token/accept', protect, teamInviteController.acceptRoleInvite);

// Decline role invite (requires authentication)
router.post('/:token/decline', protect, teamInviteController.declineRoleInvite);

module.exports = router; 