const express = require("express");
const {
  registerForHackathon,
  getMyRegistrations, // ✅ Make sure this exists
  getHackathonParticipants,
  getHackathonParticipantsWithSubmissions, // Add the new function
  unregisterFromHackathon,
  getLastRegistrationData,
  updateRegistration
} = require("../controllers/hackathonRegistrationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, registerForHackathon);

// ✅ Add this GET route
router.get("/my", protect, getMyRegistrations);

// Get last registration data for auto-filling
router.get("/last-registration", protect, getLastRegistrationData);

// ✅ Add route to get participants for a specific hackathon
router.get("/hackathon/:hackathonId/participants", protect, getHackathonParticipants);

// ✅ Add route to get participants with their submissions for organizer dashboard
router.get("/hackathon/:hackathonId/participants-with-submissions", protect, getHackathonParticipantsWithSubmissions);

// Add unregister route
router.delete('/:hackathonId', protect, unregisterFromHackathon);

// Add update registration route
router.put('/:hackathonId/update', protect, updateRegistration);

module.exports = router;
