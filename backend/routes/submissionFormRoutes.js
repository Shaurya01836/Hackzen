// routes/submissionFormRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {
  saveHackathonForm,
  submitProjectWithAnswers,
  getSubmissionById,
  submitPPTForRound,
  deletePPTSubmission,
  getSubmissionByIdAdmin,
  getSubmissionsForJudge ,
  getJudgeEvaluationsForSubmission,
} = require("../controllers/submissionFormController");
const Submission = require("../model/SubmissionModel");
const Project = require("../model/ProjectModel");
const Hackathon = require("../model/HackathonModel");

const { protect, isAdmin, isJudge } = require("../middleware/authMiddleware");

// Organizer: Save form
router.put("/hackathon/:hackathonId", protect, saveHackathonForm);

// Participant: Submit project with answers
router.post("/submit", protect, submitProjectWithAnswers);

// New: Submit PPT for a round (no project required)
router.post("/ppt", protect, submitPPTForRound);

// New: Delete PPT submission for a round
router.post("/ppt/delete", protect, deletePPTSubmission);

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
      // Also include PPT-only submissions (no projectId)
      const submissions = await Submission.find({ 
        hackathonId: hackathonObjectId, 
        submittedBy: userObjectId,
        $or: [
          { projectId: { $in: projectIds } },
          { pptFile: { $exists: true, $ne: "" } }
        ]
      })
        .populate('projectId', 'title description logo links attachments likes views likedBy images submittedBy category status')
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
        .populate('projectId', 'title description logo links attachments likes views likedBy images submittedBy category status')
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

// Add like and view endpoints for PPT submissions
router.patch('/:id/like', protect, require('../controllers/submissionFormController').likeSubmission);
router.patch('/:id/view', protect, require('../controllers/submissionFormController').viewSubmission);

// Add this route for organizer/judge evaluation viewing
router.get('/:id/judge-evaluations', protect, getJudgeEvaluationsForSubmission);

// Admin: Get total submissions stats for dashboard
router.get("/admin/stats", protect, isAdmin, require("../controllers/submissionFormController").getAdminSubmissionStats);

// Admin: Get all submissions for dashboard
router.get("/admin/all", protect, isAdmin, require("../controllers/submissionFormController").getAllSubmissionsAdmin);
// 📥 Get only the submissions assigned to a judge by team ID

// Admin/Judge/Organizer: Get all submissions for a specific hackathon
router.get("/admin/hackathon/:hackathonId", protect, async (req, res, next) => {
  if (req.user?.role === "admin" || req.user?.role === "judge") return next();
  // Allow the organizer of this hackathon
  try {
    const hackathon = await Hackathon.findById(req.params.hackathonId).select("organizer");
    if (hackathon && hackathon.organizer && hackathon.organizer.toString() === req.user.id) {
      return next();
    }
  } catch (err) {
    // fall through to forbidden
  }
  return res.status(403).json({ message: "Access denied: Admins, Judges, or Hackathon Organizer only" });
}, require("../controllers/submissionFormController").getSubmissionsByHackathonAdmin);

// Admin/Organizer: Get a single submission by ID
router.get("/admin/:id", protect, getSubmissionByIdAdmin);

// Add endpoints for deleting and editing a submission by ID
router.delete("/submission/:id", protect, require("../controllers/submissionFormController").deleteSubmissionById);
router.put("/submission/:id", protect, require("../controllers/submissionFormController").editSubmissionById);
router.get('/judge/hackathon/:hackathonId', protect, isJudge, getSubmissionsForJudge);

module.exports = router;
