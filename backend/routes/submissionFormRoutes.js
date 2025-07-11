// routes/submissionFormRoutes.js
const express = require("express");
const router = express.Router();
const {
  saveHackathonForm,
  submitProjectWithAnswers,
} = require("../controllers/submissionFormController");
const Submission = require("../model/SubmissionModel");

const { protect } = require("../middleware/authMiddleware");

// Organizer: Save form
router.put("/hackathon/:hackathonId", protect, saveHackathonForm);

// Participant: Submit project with answers
router.post("/submit", protect, submitProjectWithAnswers);

router.get("/submissions", async (req, res) => {
  try {
    const { hackathonId, userId } = req.query;
    if (!hackathonId || !userId) return res.status(400).json({ error: 'hackathonId and userId required' });
    const submissions = await Submission.find({ hackathonId, submittedBy: userId });
    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

module.exports = router;
