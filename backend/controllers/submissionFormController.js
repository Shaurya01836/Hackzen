// controllers/submissionFormController.js
const Hackathon = require("../model/HackathonModel");
const Project = require("../model/ProjectModel");

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
    const { hackathonId, projectId, customAnswers } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Attach the hackathon to the project
    project.hackathon = hackathonId;
    project.status = "submitted";
    project.submittedAt = new Date();
    project.customAnswers = customAnswers;
    await project.save();

    // Optional: Add project ID to Hackathon's submissions list
    await Hackathon.findByIdAndUpdate(hackathonId, {
      $addToSet: { submittedProjects: project._id },
    });

    res.status(200).json({ success: true, project });
  } catch (err) {
    console.error("❌ Error in submitProjectWithAnswers:", err);
    res.status(500).json({ error: "Server error during submission" });
  }
};