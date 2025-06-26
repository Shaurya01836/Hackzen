const express = require("express");
const {
  registerForHackathon,
  getMyRegistrations, // ✅ Make sure this exists
} = require("../controllers/hackathonRegistrationController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", isAuthenticated, registerForHackathon);

// ✅ Add this GET route
router.get("/my", isAuthenticated, getMyRegistrations);

module.exports = router;
