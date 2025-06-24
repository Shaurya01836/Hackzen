const express = require("express");
const router = express.Router();

const { registerForHackathon, getUserRegistrations } = require("../controllers/registrationController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const Registration = require("../schema/RegistrationFormSchema");

// ✅ Register for a hackathon
router.post("/", isAuthenticated, registerForHackathon);

// ✅ Get all hackathon IDs that the logged-in user has registered for
router.get("/my", isAuthenticated, async (req, res) => {
  const userId = req.user._id;

  try {
    const registrations = await Registration.find({ userId });
    const registeredHackathonIds = registrations.map(reg => reg.hackathonId.toString());
    res.json({ registeredHackathonIds });
  } catch (err) {
    console.error("Error getting registrations:", err);
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
});

// ✅ Check if a user is already registered for a specific hackathon
router.get("/is-registered/:hackathonId", isAuthenticated, async (req, res) => {
  const userId = req.user._id;
  const hackathonId = req.params.hackathonId;

  try {
    const existing = await Registration.findOne({ hackathonId, userId });
    res.json({ registered: !!existing });
  } catch (err) {
    console.error("Check registration error", err);
    res.status(500).json({ registered: false });
  }
});

module.exports = router;