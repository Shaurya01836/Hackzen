const express = require("express");
const { registerForHackathon } = require("../controllers/registrationController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const Registration = require("../schema/RegistrationFormSchema");

const router = express.Router();
const { getUserRegistrations } = require("../controllers/registrationController");

// ✅ backend/routes/registrationRoutes.js
router.get("/my", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const registrations = await Registration.find({ userId }).select("hackathonId");
    const registeredHackathonIds = registrations.map((r) => r.hackathonId.toString());
    res.json({ registeredHackathonIds });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch registrations" });
  }
});

router.post("/", isAuthenticated, registerForHackathon);

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
