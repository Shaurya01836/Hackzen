const express = require("express");
const router = express.Router();
const {
  createTeam,
  getTeamsByHackathon,
  getAllTeamsByHackathon,
  getTeamsWithSubmissions,
  joinTeamByCode,
  leaveTeam,
  deleteTeam,
  removeMember,
  updateTeamName,
} = require("../controllers/teamController");
const { protect } = require("../middleware/authMiddleware");

// Create a new team
router.post("/", protect, createTeam);

// Get teams for a specific hackathon
router.get("/hackathon/:hackathonId", protect, getTeamsByHackathon);

// Get all teams for a hackathon (admin/organizer view)
router.get("/hackathon/:hackathonId/all", protect, getAllTeamsByHackathon);

// Get teams with their submissions for organizer dashboard
router.get("/hackathon/:hackathonId/teams-with-submissions", protect, getTeamsWithSubmissions);

// Join a team by code
router.get("/join/:teamCode", protect, joinTeamByCode);

// Leave a team
router.delete("/:teamId/leave", protect, leaveTeam);

// Delete a team (only leader can do this)
router.delete("/:id", protect, deleteTeam);

// Remove a member from team (only leader can do this)
router.delete("/:teamId/members/:memberId", protect, removeMember);

// Update team name (only leader can do this)
router.put("/:teamId/name", protect, updateTeamName);

module.exports = router;
