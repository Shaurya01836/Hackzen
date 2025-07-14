// routes/submissionFormRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {
  saveHackathonForm,
  submitProjectWithAnswers,
  getSubmissionById,
  submitPPTForRound,
} = require("../controllers/submissionFormController");
const Submission = require("../model/SubmissionModel");
const Project = require("../model/ProjectModel");

const { protect } = require("../middleware/authMiddleware");

// Organizer: Save form
router.put("/hackathon/:hackathonId", protect, saveHackathonForm);

// Participant: Submit project with answers
router.post("/submit", protect, submitProjectWithAnswers);

// New: Submit PPT for a round (no project required)
router.post("/ppt", protect, submitPPTForRound);

router.get("/submissions", async (req, res) => {
  try {
    const { hackathonId, userId } = req.query;

    // 1. If both hackathonId and userId are provided: (for dropdown/duplicate prevention)
    if (hackathonId && userId) {
      const HackathonRegistration = require("../model/HackathonRegistrationModel");
      const hackathonObjectId = mongoose.Types.ObjectId.isValid(hackathonId) ? hackathonId : null;
      const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? userId : null;

      if (!hackathonObjectId || !userObjectId) {
        return res.json({ submissions: [] });
      }

      // Registration check
      const isRegistered = await HackathonRegistration.findOne({ 
        hackathonId: hackathonObjectId, 
        userId: userObjectId 
      }).sort({ createdAt: -1 });

      if (!isRegistered) {
        return res.json({ submissions: [] });
      }

      // Get all user's projects (do NOT filter by hackathon)
      const userProjects = await Project.find({ 
        submittedBy: userObjectId
      }).select('_id');

      const projectIds = userProjects.map(project => project._id);

      // Find submissions for user's projects in this hackathon
      const submissions = await Submission.find({ 
        projectId: { $in: projectIds },
        hackathonId: hackathonObjectId 
      })
        .populate('projectId', 'title description logo links attachments')
        .populate('hackathonId', 'title name')
        .sort({ submittedAt: -1 });

      // Return full populated submissions for frontend
      return res.json({ submissions });
    }

    // 2. If only userId is provided: (for My Submissions page)
    if (userId && !hackathonId) {
      const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? userId : null;
      if (!userObjectId) return res.json({ submissions: [] });
      
      // Get all projects that belong to this user
      const userProjects = await Project.find({ submittedBy: userObjectId }).select('_id');
      const projectIds = userProjects.map(project => project._id);

      // Find all submissions for user's projects
      const submissions = await Submission.find({ projectId: { $in: projectIds } })
        .populate('projectId', 'title description logo links attachments')
        .populate('hackathonId', 'title name')
        .sort({ submittedAt: -1 });
      
      // For My Submissions page, return full populated data
      return res.json({ submissions });
    }

    // 3. If neither or only hackathonId is provided: error
    return res.status(400).json({ error: 'userId required' });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});
// Debug endpoint to check registration status
router.get("/debug/registration", async (req, res) => {
  try {
    const { hackathonId, userId } = req.query;
    if (!hackathonId || !userId) return res.status(400).json({ error: 'hackathonId and userId required' });
    
    const HackathonRegistration = require("../model/HackathonRegistrationModel");
    const isRegistered = await HackathonRegistration.findOne({ hackathonId, userId });
    
    res.json({ 
      hackathonId, 
      userId, 
      isRegistered: !!isRegistered,
      registrationDetails: isRegistered ? {
        id: isRegistered._id,
        createdAt: isRegistered.createdAt
      } : null
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check registration status' });
  }
});

// Add endpoints for deleting and editing a submission by ID
router.delete("/submission/:id", protect, require("../controllers/submissionFormController").deleteSubmissionById);
router.put("/submission/:id", protect, require("../controllers/submissionFormController").editSubmissionById);

module.exports = router;
