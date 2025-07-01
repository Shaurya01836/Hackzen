const express = require("express");
const {
  registerForHackathon,
  getMyRegistrations, // ✅ Make sure this exists
  getHackathonParticipants,
  unregisterFromHackathon
} = require("../controllers/hackathonRegistrationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, registerForHackathon);

// ✅ Add this GET route
router.get("/my", protect, getMyRegistrations);

// ✅ Add route to get participants for a specific hackathon
router.get("/hackathon/:hackathonId/participants", protect, getHackathonParticipants);

// Add unregister route
router.delete('/:hackathonId', protect, unregisterFromHackathon);

module.exports = router;
