const express = require('express');
const router = express.Router();
const teamInviteController = require('../controllers/teamInviteController');
const { protect } = require('../middleware/authMiddleware');

// Create an invite
router.post('/', protect, teamInviteController.createInvite);

// Get invite details by ID
router.get('/:id', teamInviteController.getInviteById);

// Respond to an invite (accept or decline)
router.put('/:id/respond', protect, teamInviteController.respondToInvite);

// Get all invites for the logged-in user
router.get('/my', protect, teamInviteController.getMyInvites);

// Get invites for a specific hackathon
router.get('/hackathon/:hackathonId', protect, teamInviteController.getHackathonInvites);

// Accept invite by id (for invite link)
router.post('/:id/accept', protect, teamInviteController.acceptInviteById);

// Revoke (delete) a pending invite
router.delete('/:id', protect, teamInviteController.deleteInvite);

// Role Invite routes for judge/mentor
router.get('/role-invites/:token', teamInviteController.getRoleInviteByToken);
router.post('/role-invites/:token/accept', protect, teamInviteController.acceptRoleInvite);
router.post('/role-invites/:token/decline', protect, teamInviteController.declineRoleInvite);

module.exports = router;
