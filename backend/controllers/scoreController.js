const Score = require("../model/ScoreModel");
const Project = require("../model/ProjectModel");
const RoleInvite = require("../model/RoleInviteModel");
const Submission = require("../model/SubmissionModel");

exports.createOrUpdateScore = async (req, res) => {
  const judge = req.user._id;
  const { project, hackathon, scores, feedback } = req.body;

  try {
    let existing = await Score.findOne({ project, judge });

    if (existing) {
      existing.scores = scores;
      existing.feedback = feedback;
      await existing.save();
      return res.json({ message: "Score updated successfully" });
    }

    const newScore = new Score({ project, hackathon, judge, scores, feedback });
    await newScore.save();

    // Optionally: Push the score ref to Project
    await Project.findByIdAndUpdate(project, {
      $addToSet: { scores: newScore._id }
    });

    res.status(201).json({ message: "Score submitted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting score" });
  }
};
exports.getMyScoredProjects = async (req, res) => {
  try {
    const scores = await Score.find({ judge: req.user._id }).select("project");
    const projectIds = scores.map(score => score.project.toString());
    res.json(projectIds);
  } catch (err) {
    console.error("Failed to get judged project IDs", err);
    res.status(500).json({ message: "Failed to fetch judged projects" });
  }
};

exports.getScoresForProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const scores = await Score.find({ project: projectId }).populate("judge", "name email");
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: "Failed to get scores" });
  }
};

exports.getProjectsToScore = async (req, res) => {
  try {
    const judge = req.user._id;
    const hackathonId = req.params.hackathonId;

    const projects = await Project.find({ hackathon: hackathonId }).populate("submittedBy");
    const scored = await Score.find({ hackathon: hackathonId, judge });

    const scoredMap = {};
    scored.forEach(s => scoredMap[s.project.toString()] = true);

    const data = projects.map(p => ({
      ...p.toObject(),
      alreadyScored: scoredMap[p._id.toString()] || false,
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to get projects" });
  }
};

exports.getAllScoresForHackathon = async (req, res) => {
  try {
    const hackathonId = req.params.hackathonId;
    // Find all scores for this hackathon, populate judge, project, and project.team
    const scores = await Score.find({ hackathon: hackathonId })
      .populate("judge", "name email role")
      .populate({
        path: "project",
        select: "title team type",
        populate: { path: "team", select: "name" }
      });

    // For each score, fetch the problem statement from Submission
    const scoresWithProblem = await Promise.all(scores.map(async (score) => {
      let problemStatement = null;
      let team = null;
      if (score.project && score.project._id) {
        const submission = await Submission.findOne({
          projectId: score.project._id,
          hackathonId
        }).populate({ path: "team", select: "name" });
        problemStatement = submission?.problemStatement || null;
        // If team is not set on project, try to get from submission
        team = score.project.team || submission?.team || null;
      }
      return {
        ...score.toObject(),
        problemStatement,
        team: team ? (team.name ? { name: team.name } : team) : null
      };
    }));

    // --- Add PPT-only reviewed submissions ---
    // Find all reviewed PPT submissions for this hackathon (no projectId, has pptFile, status reviewed)
    const pptReviewed = await Submission.find({
      hackathonId,
      pptFile: { $exists: true, $ne: null },
      status: "reviewed"
    })
      .populate({ path: "selectedMembers", select: "name email" })
      .populate({ path: "team", select: "name" });

    // Map to a similar structure as scoresWithProblem
    const pptJudged = pptReviewed.map((ppt) => ({
      _id: ppt._id,
      isPPT: true,
      judge: null, // If you have a judge, add here
      project: null,
      team: ppt.team ? { name: ppt.team.name } : null,
      problemStatement: ppt.problemStatement || null,
      scores: ppt.scores || null, // If you store scores for PPT, add here
      feedback: ppt.feedback || null, // If you store feedback for PPT, add here
      submittedBy: ppt.submittedBy,
      selectedMembers: ppt.selectedMembers,
      pptFile: ppt.pptFile,
      submittedAt: ppt.submittedAt
    }));

    // Combine both arrays
    const allJudged = [...scoresWithProblem, ...pptJudged];

    res.json(allJudged);
  } catch (err) {
    res.status(500).json({ message: "Failed to get all scores for hackathon" });
  }
};
