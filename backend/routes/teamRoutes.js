const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

// Create a new team
router.post('/', protect, teamController.createTeam);

// Join a team
router.put('/:id/add-member', protect, teamController.addMember);

// Join team by code
router.get('/join/:teamCode', protect, teamController.joinTeamByCode);

// Get all teams in a hackathon
router.get('/hackathon/:hackathonId', protect, teamController.getTeamsByHackathon);

// Get one team by ID
router.get('/:id', teamController.getTeamById);

// Delete a team (leader only)
router.delete('/:id', protect, teamController.deleteTeam);

// Remove a member from a team (leader only)
router.delete('/:teamId/members/:memberId', protect, teamController.removeMember);

module.exports = router;
