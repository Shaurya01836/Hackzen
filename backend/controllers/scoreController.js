const Score = require("../model/ScoreModel");
const Submission = require("../model/SubmissionModel");
const RoleInvite = require("../model/RoleInviteModel");

exports.createOrUpdateScore = async (req, res) => {
  const judge = req.user._id;
  const { submission, scores, feedback } = req.body;

  try {
    console.log('🔍 Backend - createOrUpdateScore called with:', { submission, scores, feedback, judge });

    // Validate required fields
    if (!submission || !scores) {
      return res.status(400).json({ message: "Submission and scores are required" });
    }

    // Calculate total score from the criteria scores
    const criteriaScores = Object.values(scores).filter(score => typeof score === 'number');
    const totalScore = criteriaScores.length > 0 
      ? criteriaScores.reduce((sum, score) => sum + score, 0) / criteriaScores.length
      : 0;

    // Convert scores to the expected Map format
    const scoresMap = new Map();
    Object.entries(scores).forEach(([key, value]) => {
      scoresMap.set(key, {
        score: Number(value),
        maxScore: 10,
        weight: 1
      });
    });

    let existing = await Score.findOne({ submission, judge });

    if (existing) {
      existing.scores = scoresMap;
      existing.feedback = feedback;
      existing.totalScore = totalScore;
      await existing.save();
      console.log('🔍 Backend - Score updated successfully');
      return res.json({ message: "Score updated successfully" });
    }

    // Get submission details to determine roundIndex and submissionType
    const submissionDoc = await Submission.findById(submission);
    if (!submissionDoc) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const newScore = new Score({ 
      submission, 
      judge, 
      scores: scoresMap,
      feedback,
      totalScore,
      roundIndex: submissionDoc.roundIndex || 1,
      submissionType: submissionDoc.pptFile ? 'presentation' : 'project'
    });
    
    await newScore.save();
    console.log('🔍 Backend - Score created successfully');

    // Optional: Link score to the submission (if needed)
    await Submission.findByIdAndUpdate(submission, {
      $addToSet: { scores: newScore._id }
    });

    res.status(201).json({ message: "Score submitted" });
  } catch (err) {
    console.error('🔍 Backend - Error in createOrUpdateScore:', err);
    res.status(500).json({ message: "Error submitting score", error: err.message });
  }
};

exports.getMyScoredSubmissions = async (req, res) => {
  try {
    const scores = await Score.find({ judge: req.user._id }).select("submission");
    const submissionIds = scores.map(score => score.submission.toString());
    res.json(submissionIds);
  } catch (err) {
    console.error("Failed to get judged submission IDs", err);
    res.status(500).json({ message: "Failed to fetch judged submissions" });
  }
};

// Get current judge's score for a specific submission
exports.getMyScoreForSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const judgeId = req.user._id;

    if (!submissionId || !submissionId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid submissionId" });
    }

    const score = await Score.findOne({ 
      submission: submissionId, 
      judge: judgeId 
    });

    if (!score) {
      return res.json({ score: null });
    }

    // Convert Map to object for frontend compatibility
    const scoresObject = {};
    if (score.scores && score.scores instanceof Map) {
      score.scores.forEach((value, key) => {
        scoresObject[key] = value.score;
      });
    } else if (score.scores && typeof score.scores === 'object') {
      Object.assign(scoresObject, score.scores);
    }

    res.json({
      score: {
        _id: score._id,
        submission: score.submission,
        judge: score.judge,
        scores: scoresObject,
        feedback: score.feedback,
        totalScore: score.totalScore,
        createdAt: score.createdAt,
        updatedAt: score.updatedAt
      }
    });
  } catch (err) {
    console.error("Failed to get judge's score for submission", err);
    res.status(500).json({ message: "Failed to fetch judge's score" });
  }
};

exports.getScoresForSubmission = async (req, res) => {
  try {
    const submissionId = req.params.submissionId;
    if (!submissionId || !submissionId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid submissionId" });
    }
    const scores = await Score.find({ submission: submissionId }).populate("judge", "name email");
    
    // Convert Map to object for frontend compatibility
    const formattedScores = scores.map(score => {
      const scoresObject = {};
      if (score.scores && score.scores instanceof Map) {
        score.scores.forEach((value, key) => {
          scoresObject[key] = value.score;
        });
      } else if (score.scores && typeof score.scores === 'object') {
        Object.assign(scoresObject, score.scores);
      }
      
      return {
        ...score.toObject(),
        scores: scoresObject
      };
    });
    
    res.json(formattedScores);
  } catch (err) {
    console.error("getScoresForSubmission error:", err);
    res.status(500).json({ message: "Failed to get scores", error: err.message });
  }
};

exports.getSubmissionsToScore = async (req, res) => {
  try {
    const judge = req.user._id;
    const hackathonId = req.params.hackathonId;

    const submissions = await Submission.find({ hackathonId, status: "submitted" })
      .populate("submittedBy", "name email")
      .populate("projectId", "title type")
      .populate("selectedMembers", "name email");

    const scored = await Score.find({ judge }).select("submission");
    const scoredMap = {};
    scored.forEach(s => scoredMap[s.submission.toString()] = true);

    const data = submissions.map(s => ({
      ...s.toObject(),
      alreadyScored: scoredMap[s._id.toString()] || false,
    }));

    res.json(data);
  } catch (err) {
    console.error("Error in getSubmissionsToScore:", err);
    res.status(500).json({ message: "Failed to get submissions" });
  }
};

exports.getAllScoresForHackathon = async (req, res) => {
  try {
    const hackathonId = req.params.hackathonId;

    const scores = await Score.find()
      .populate("judge", "name email role")
      .populate({
        path: "submission",
        match: { hackathonId },
        populate: [
          { path: "submittedBy", select: "name email" },
          { 
            path: "projectId", 
            select: "title type team",
            populate: { path: "team", select: "name" } // Ensure team is populated
          },
          { path: "selectedMembers", select: "name email" }
        ]
      });

    const validScores = scores.filter(s => s.submission); // Filter out unmatched (null) ones

    const allJudged = validScores.map(s => {
      const sub = s.submission;
      let teamObj = null;
      // If project has a team, use that
      if (sub.projectId && sub.projectId.team && sub.projectId.team.name) {
        teamObj = { name: sub.projectId.team.name };
      } else if (sub.selectedMembers && sub.selectedMembers.length > 0) {
        // Fallback: use member names
        teamObj = { name: sub.selectedMembers.map(m => m.name || m.email).join(", ") };
      } else if (sub.submittedBy) {
        teamObj = { name: sub.submittedBy.name || sub.submittedBy.email };
      }

      // Convert Map to object for frontend compatibility
      const scoresObject = {};
      if (s.scores && s.scores instanceof Map) {
        s.scores.forEach((value, key) => {
          scoresObject[key] = value.score;
        });
      } else if (s.scores && typeof s.scores === 'object') {
        Object.assign(scoresObject, s.scores);
      }
      
      return {
        _id: s._id,
        judge: s.judge,
        submissionId: sub._id,
        team: teamObj,
        project: sub.projectId || null,
        problemStatement: sub.problemStatement || null,
        pptFile: sub.pptFile || null,
        roundIndex: sub.roundIndex || null,
        feedback: s.feedback,
        scores: scoresObject,
        submittedAt: sub.submittedAt
      };
    });

    res.json(allJudged);
  } catch (err) {
    console.error("Error in getAllScoresForHackathon:", err);
    res.status(500).json({ message: "Failed to get all scores for hackathon" });
  }
};

// Get scores for multiple submissions
exports.getScoresForSubmissions = async (req, res) => {
  try {
    const { submissionIds } = req.body;
    
    if (!submissionIds || !Array.isArray(submissionIds)) {
      return res.status(400).json({ message: "Invalid submissionIds array" });
    }

    const scores = await Score.find({ 
      submission: { $in: submissionIds } 
    }).populate("judge", "name email");

    // Group scores by submission ID
    const scoresBySubmission = {};
    scores.forEach(score => {
      const submissionId = score.submission.toString();
      if (!scoresBySubmission[submissionId]) {
        scoresBySubmission[submissionId] = [];
      }
      
      // Convert Map to object for frontend compatibility
      const scoresObject = {};
      if (score.scores && score.scores instanceof Map) {
        score.scores.forEach((value, key) => {
          scoresObject[key] = value.score;
        });
      } else if (score.scores && typeof score.scores === 'object') {
        // Handle case where scores might already be an object
        Object.assign(scoresObject, score.scores);
      }
      
      scoresBySubmission[submissionId].push({
        submissionId: submissionId,
        judgeId: score.judge._id,
        judgeName: score.judge.name,
        judgeEmail: score.judge.email,
        scores: scoresObject,
        feedback: score.feedback,
        submittedAt: score.createdAt
      });
    });

    res.json(Object.values(scoresBySubmission).flat());
  } catch (err) {
    console.error("Error in getScoresForSubmissions:", err);
    res.status(500).json({ message: "Failed to get scores for submissions" });
  }
};
