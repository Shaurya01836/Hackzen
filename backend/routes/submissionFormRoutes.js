// routes/submissionFormRoutes.js
const express = require("express");
const mongoose = require("mongoose");
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
    
    console.log('🔍 Checking submissions for hackathon:', hackathonId, 'user:', userId);
    
    // Check if user is currently registered for this hackathon
    const HackathonRegistration = require("../model/HackathonRegistrationModel");
    
    // Convert to ObjectId if they're strings
    const hackathonObjectId = mongoose.Types.ObjectId.isValid(hackathonId) ? hackathonId : null;
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? userId : null;
    
    if (!hackathonObjectId || !userObjectId) {
      console.log('❌ Invalid ObjectId format:', { hackathonId, userId });
      return res.json({ submissions: [] });
    }
    
    // Get the most recent registration for this user and hackathon
    const isRegistered = await HackathonRegistration.findOne({ 
      hackathonId: hackathonObjectId, 
      userId: userObjectId 
    }).sort({ createdAt: -1 }); // Get the most recent registration
    
    console.log('📋 Registration status:', isRegistered ? 'REGISTERED' : 'NOT REGISTERED');
    console.log('📋 Registration query:', { hackathonId, userId });
    if (isRegistered) {
      console.log('📋 Registration details:', {
        id: isRegistered._id,
        createdAt: isRegistered.createdAt,
        formData: isRegistered.formData
      });
    }
    
    // Only return submissions if user is currently registered
    if (!isRegistered) {
      console.log('❌ User not registered, returning empty submissions');
      return res.json({ submissions: [] });
    }
    
    const submissions = await Submission.find({ hackathonId, submittedBy: userId });
    console.log('✅ Found submissions:', submissions.length);
    res.json({ submissions });
  } catch (err) {
    console.error('❌ Error fetching submissions:', err);
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

module.exports = router;
