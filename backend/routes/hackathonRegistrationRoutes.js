const express = require("express");
const {
  registerForHackathon,
  getMyRegistrations, // ✅ Make sure this exists
  getHackathonParticipants
} = require("../controllers/hackathonRegistrationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, registerForHackathon);

// ✅ Add this GET route
router.get("/my", protect, getMyRegistrations);

// ✅ Add route to get participants for a specific hackathon
router.get("/hackathon/:hackathonId/participants", protect, getHackathonParticipants);

module.exports = router;
