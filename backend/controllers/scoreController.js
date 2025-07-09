const Score = require("../model/ScoreModel");
const Project = require("../model/ProjectModel");
const RoleInvite = require("../model/RoleInviteModel");

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
