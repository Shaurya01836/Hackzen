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

// Get all teams for a project
router.get('/project/:projectId', protect, teamController.getTeamsByProject);

// Get one team by ID
router.get('/:id', teamController.getTeamById);

// Update team description (leader only)
router.put('/:teamId/description', protect, teamController.updateTeamDescription);

// Delete a team (leader only)
router.delete('/:id', protect, teamController.deleteTeam);

// Remove a member from a team (leader only)
router.delete('/:teamId/members/:memberId', protect, teamController.removeMember);

// Member leaves team (remove self)
router.delete('/:teamId/leave', protect, teamController.leaveTeam);

module.exports = router;
