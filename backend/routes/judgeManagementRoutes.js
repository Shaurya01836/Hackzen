const express = require('express');
const router = express.Router();
const judgeManagementController = require('../controllers/judgeManagementController');
const { protect, isOrganizerOrAdmin } = require('../middleware/authMiddleware');

// 🎯 Problem Statement Management
router.post('/hackathons/:hackathonId/problem-statements', protect, isOrganizerOrAdmin, judgeManagementController.addProblemStatements);

// 🎯 Judge Assignment Management
router.post('/hackathons/:hackathonId/assign-judges', protect, isOrganizerOrAdmin, judgeManagementController.assignJudges);
router.get('/hackathons/:hackathonId/judge-assignments', protect, isOrganizerOrAdmin, judgeManagementController.getJudgeAssignments);
router.put('/judge-assignments/:assignmentId', protect, isOrganizerOrAdmin, judgeManagementController.updateJudgeAssignment);
router.delete('/judge-assignments/:assignmentId', protect, isOrganizerOrAdmin, judgeManagementController.removeJudgeAssignment);

// Assign teams to a judge assignment
router.post('/judge-assignments/:assignmentId/assign-teams', protect, isOrganizerOrAdmin, judgeManagementController.assignTeamsToJudge);

// Set assignment mode for a round or problem statement
router.post('/hackathons/:hackathonId/:type/:index/assignment-mode', protect, isOrganizerOrAdmin, judgeManagementController.setAssignmentMode);

// Auto-distribute teams among judges
router.post('/hackathons/:hackathonId/:type/:index/auto-distribute', protect, isOrganizerOrAdmin, judgeManagementController.autoDistributeTeams);

// 🎯 Judge Availability and Permissions
router.get('/hackathons/:hackathonId/problem-statements/:problemStatementId/available-judges', protect, isOrganizerOrAdmin, judgeManagementController.getAvailableJudges);

// 🎯 Judge Assignment Details
router.get('/judge-assignments/:assignmentId', protect, judgeManagementController.getJudgeAssignmentDetails);

// 🎯 Judge Invitation Responses
router.post('/judge-assignments/:assignmentId/respond', protect, judgeManagementController.respondToInvitation);

// 🎯 Judge Dashboard
router.get('/judge/dashboard', protect, judgeManagementController.getJudgeDashboard);

module.exports = router; 