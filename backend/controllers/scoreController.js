const Score = require("../model/ScoreModel");
const Submission = require("../model/SubmissionModel");
const RoleInvite = require("../model/RoleInviteModel");

exports.createOrUpdateScore = async (req, res) => {
  const judge = req.user._id;
  const { submission, scores, feedback } = req.body;

  try {
    let existing = await Score.findOne({ submission, judge });

    if (existing) {
      existing.scores = scores;
      existing.feedback = feedback;
      await existing.save();
      return res.json({ message: "Score updated successfully" });
    }

    const newScore = new Score({ submission, judge, scores, feedback });
    await newScore.save();

    // Optional: Link score to the submission (if needed)
    await Submission.findByIdAndUpdate(submission, {
      $addToSet: { scores: newScore._id }
    });

    res.status(201).json({ message: "Score submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting score" });
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

exports.getScoresForSubmission = async (req, res) => {
  try {
    const submissionId = req.params.submissionId;
    if (!submissionId || !submissionId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid submissionId" });
    }
    const scores = await Score.find({ submission: submissionId }).populate("judge", "name email");
    res.json(scores);
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

      return {
        _id: s._id,
        judge: s.judge,
        submissionId: sub._id,
        team: teamObj,
        project: sub.projectId || null,
        problemStatement: sub.problemStatement || null,
        pptFile: sub.pptFile || null,
        feedback: s.feedback,
        scores: s.scores,
        submittedAt: sub.submittedAt
      };
    });

    res.json(allJudged);
  } catch (err) {
    console.error("Error in getAllScoresForHackathon:", err);
    res.status(500).json({ message: "Failed to get all scores for hackathon" });
  }
};
