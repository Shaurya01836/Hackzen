const express = require("express");
const {
  registerForHackathon,
  getMyRegistrations, // ✅ Make sure this exists
  getHackathonParticipants
} = require("../controllers/hackathonRegistrationController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", isAuthenticated, registerForHackathon);

// ✅ Add this GET route
router.get("/my", isAuthenticated, getMyRegistrations);

// ✅ Add route to get participants for a specific hackathon
router.get("/hackathon/:hackathonId/participants", isAuthenticated, getHackathonParticipants);

module.exports = router;
