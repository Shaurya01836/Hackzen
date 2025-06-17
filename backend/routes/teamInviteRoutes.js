const express = require('express');
const router = express.Router();
const teamInviteController = require('../controllers/teamInviteController');
const { protect } = require('../middleware/authMiddleware');

// Create an invite
router.post('/', protect, teamInviteController.createInvite);

// Respond to an invite (accept or decline)
router.put('/:id/respond', protect, teamInviteController.respondToInvite);

// Get all invites for the logged-in user
router.get('/my', protect, teamInviteController.getMyInvites);

module.exports = router;
