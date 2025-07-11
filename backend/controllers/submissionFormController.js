// controllers/submissionFormController.js
const Hackathon = require("../model/HackathonModel");
const Project = require("../model/ProjectModel");
const Submission = require("../model/SubmissionModel");

exports.saveHackathonForm = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const { questions, terms } = req.body;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    hackathon.customForm = { questions, terms };
    await hackathon.save();

    res.status(200).json({ message: "Custom submission form saved.", hackathon });
  } catch (err) {
    console.error("❌ Error saving custom form:", err);
    res.status(500).json({ message: "Server error saving custom form." });
  }
};

exports.submitProjectWithAnswers = async (req, res) => {
  try {
    const { hackathonId, projectId, customAnswers, problemStatement } = req.body;
    const userId = req.user._id;

    // Check for duplicate submission
    const existing = await Submission.findOne({ hackathonId, projectId, submittedBy: userId });
    if (existing) {
      console.error('❌ Duplicate submission attempt:', { hackathonId, projectId, userId });
      return res.status(400).json({ error: "You have already submitted this project to this hackathon." });
    }

    // Create new submission
    const submission = await Submission.create({
      hackathonId,
      projectId,
      submittedBy: userId,
      problemStatement,
      customAnswers,
      status: 'submitted',
    });

    res.status(200).json({ success: true, submission });
  } catch (err) {
    console.error("❌ Error in submitProjectWithAnswers:", err, req.body);
    res.status(500).json({ error: "Server error during submission", details: err.message, stack: err.stack });
  }
};