// routes/submissionFormRoutes.js
const express = require("express");
const router = express.Router();
const {
  saveHackathonForm,
  submitProjectWithAnswers,
} = require("../controllers/submissionFormController");

const { protect } = require("../middleware/authMiddleware");

// Organizer: Save form
router.put("/hackathon/:hackathonId", protect, saveHackathonForm);

// Participant: Submit project with answers
router.post("/submit", protect, submitProjectWithAnswers);

module.exports = router;
