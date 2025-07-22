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
    const { hackathonId, projectId, customAnswers, problemStatement, selectedMembers = [], pptFile, roundIndex } = req.body;
    const userId = req.user._id;

    // ✅ Check if user is currently registered for this hackathon
    const Registration = require("../model/HackathonRegistrationModel");
    const isRegistered = await Registration.findOne({ hackathonId, userId });
    if (!isRegistered) {
      return res.status(400).json({ 
        error: "You must be registered for this hackathon to submit a project. Please register first and then try submitting again." 
      });
    }

    // Check for duplicate submission
    const existing = await Submission.findOne({ hackathonId, projectId, submittedBy: userId });
    if (existing) {
      console.error('❌ Duplicate submission attempt:', { hackathonId, projectId, userId });
      return res.status(400).json({ 
        error: "You have already submitted this project to this hackathon. You cannot submit the same project twice." 
      });
    }

    // Check if user has reached the max submissions for this hackathon
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }
    const userSubmissionCount = await Submission.countDocuments({ hackathonId, submittedBy: userId, roundIndex });
    if (userSubmissionCount >= (hackathon.maxSubmissionsPerParticipant || 1)) {
      return res.status(400).json({ error: `You have reached the maximum number of submissions (${hackathon.maxSubmissionsPerParticipant || 1}) for this round.` });
    }

    // Create new submission
    const submission = await Submission.create({
      hackathonId,
      projectId,
      submittedBy: userId,
      problemStatement,
      customAnswers,
      status: 'submitted',
      selectedMembers,
      pptFile, // Save pptFile if provided
      roundIndex, // Save roundIndex if provided
    });

    // Update the project status and hackathon link
    await Project.findByIdAndUpdate(projectId, {
      status: 'submitted',
      hackathon: hackathonId,
      submittedAt: new Date(),
    });

    res.status(200).json({ success: true, submission });
  } catch (err) {
    console.error("❌ Error in submitProjectWithAnswers:", err, req.body);
    res.status(500).json({ error: "Server error during submission", details: err.message, stack: err.stack });
  }
};

// New: Submit PPT for a round (no project required)
exports.submitPPTForRound = async (req, res) => {
  console.log('submitPPTForRound called', req.body);
  try {
    const { hackathonId, roundIndex, pptFile } = req.body;
    const userId = req.user._id;
    if (!hackathonId || typeof roundIndex !== 'number' || !pptFile) {
      return res.status(400).json({ success: false, error: 'hackathonId, roundIndex, and pptFile are required' });
    }
    // Check registration
    const Registration = require("../model/HackathonRegistrationModel");
    const isRegistered = await Registration.findOne({ hackathonId, userId });
    if (!isRegistered) {
      return res.status(400).json({ success: false, error: 'You must be registered for this hackathon to submit a PPT.' });
    }
    // Check for existing submission for this user/round/hackathon
    let submission = await Submission.findOne({ hackathonId, roundIndex, submittedBy: userId });
    if (submission) {
      // Replace the pptFile (edit)
      submission.pptFile = pptFile;
      submission.submittedAt = new Date();
      await submission.save();
      return res.status(200).json({ success: true, submission, replaced: true });
    } else {
      // Create new submission
      submission = await Submission.create({
        hackathonId,
        roundIndex,
        pptFile,
        submittedBy: userId,
        status: 'submitted',
        submittedAt: new Date(),
      });
      return res.status(200).json({ success: true, submission, replaced: false });
    }
  } catch (err) {
    console.error('❌ Error in submitPPTForRound:', err, req.body);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// New: Delete PPT submission for a round
exports.deletePPTSubmission = async (req, res) => {
  try {
    const { hackathonId, roundIndex } = req.body;
    const userId = req.user._id;
    if (!hackathonId || typeof roundIndex !== 'number') {
      return res.status(400).json({ error: 'hackathonId and roundIndex are required' });
    }
    const submission = await Submission.findOneAndDelete({ hackathonId, roundIndex, submittedBy: userId });
    if (!submission) {
      return res.status(404).json({ error: 'No PPT submission found to delete' });
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ Error in deletePPTSubmission:', err, req.body);
    res.status(500).json({ error: 'Server error during PPT deletion', details: err.message });
  }
};

exports.deleteSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const submission = await Submission.findById(id).populate('hackathonId');
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    if (submission.submittedBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this submission' });
    }
    await Submission.findByIdAndDelete(id);
    res.json({ success: true, message: 'Submission deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete submission', details: err.message });
  }
};

exports.editSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { customAnswers, problemStatement, selectedMembers, projectId } = req.body;
    const submission = await Submission.findById(id).populate('hackathonId');
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    if (submission.submittedBy.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to edit this submission' });
    }
    // Check deadline
    const deadline = submission.hackathonId.submissionDeadline;
    if (deadline && new Date() > new Date(deadline)) {
      return res.status(400).json({ error: 'Cannot edit after submission deadline' });
    }
    // If projectId is being changed, validate
    if (projectId && projectId.toString() !== submission.projectId.toString()) {
      const Project = require('../model/ProjectModel');
      const project = await Project.findById(projectId);
      if (!project) return res.status(400).json({ error: 'Project not found' });
      if (project.submittedBy.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'You do not own this project' });
      }
      // Check if this project is already submitted to this hackathon
      const alreadySubmitted = await Submission.findOne({
        hackathonId: submission.hackathonId._id,
        projectId,
        _id: { $ne: id },
      });
      if (alreadySubmitted) {
        return res.status(400).json({ error: 'This project is already submitted to this hackathon' });
      }
      submission.projectId = projectId;
    }
    if (customAnswers !== undefined) submission.customAnswers = customAnswers;
    if (problemStatement !== undefined) submission.problemStatement = problemStatement;
    if (selectedMembers !== undefined) submission.selectedMembers = selectedMembers;
    await submission.save();
    // Populate projectId for response
    await submission.populate('projectId');
    res.json({ success: true, submission });
  } catch (err) {
    res.status(500).json({ error: 'Failed to edit submission', details: err.message });
  }
};

// Admin: Get total submissions count for dashboard
exports.getAdminSubmissionStats = async (req, res) => {
  try {
    // Get total submissions count
    const totalSubmissions = await Submission.countDocuments();

    // Get submissions created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const submissionsThisMonth = await Submission.countDocuments({
      submittedAt: { $gte: startOfMonth }
    });

    // Calculate percentage change from last month
    const startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);
    const endOfLastMonth = new Date();
    endOfLastMonth.setDate(1);
    endOfLastMonth.setHours(0, 0, 0, 0);
    const submissionsLastMonth = await Submission.countDocuments({
      submittedAt: { $gte: startOfLastMonth, $lt: endOfLastMonth }
    });

    const submissionGrowthPercentage = submissionsLastMonth > 0 
      ? ((submissionsThisMonth - submissionsLastMonth) / submissionsLastMonth * 100).toFixed(1)
      : submissionsThisMonth > 0 ? 100 : 0;

    res.json({
      totalSubmissions,
      submissionsThisMonth,
      submissionGrowthPercentage: submissionGrowthPercentage > 0 ? `+${submissionGrowthPercentage}%` : `${submissionGrowthPercentage}%`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin: Get all submissions with full info for dashboard
exports.getAllSubmissionsAdmin = async (req, res) => {
  try {
    // Find all submissions, populate project, hackathon, and submittedBy
    const submissions = await Submission.find()
      .populate({
        path: 'projectId',
        select: 'title description technologies links attachments',
      })
      .populate({
        path: 'hackathonId',
        select: 'title',
      })
      .populate({
        path: 'submittedBy',
        select: 'name email',
      })
      .sort({ submittedAt: -1 });

    // Add submittedByName and teamName if available
    const formatted = submissions.map(sub => ({
      ...sub.toObject(),
      submittedByName: sub.submittedBy?.name || sub.submittedBy?.email || '-',
      teamName: sub.teamName || '-',
    }));

    res.json({ submissions: formatted });
  } catch (err) {
    console.error('Error fetching all admin submissions:', err);
    res.status(500).json({ error: 'Failed to fetch all submissions for admin' });
  }
};

// Admin: Get all submissions for a specific hackathon
exports.getSubmissionsByHackathonAdmin = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const submissions = await Submission.find({ hackathonId })
      .populate({
        path: 'projectId',
        select: 'title description technologies links attachments',
      })
      .populate({
        path: 'hackathonId',
        select: 'title',
      })
      .populate({
        path: 'submittedBy',
        select: 'name email',
      })
      .sort({ submittedAt: -1 });

    const formatted = submissions.map(sub => ({
      ...sub.toObject(),
      submittedByName: sub.submittedBy?.name || sub.submittedBy?.email || '-',
      teamName: sub.teamName || '-',
    }));

    res.json({ submissions: formatted });
  } catch (err) {
    console.error('Error fetching hackathon submissions (admin):', err);
    res.status(500).json({ error: 'Failed to fetch hackathon submissions for admin' });
  }
};

exports.getSubmissionByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id)
      .populate({
        path: 'projectId',
        select: 'title description technologies links attachments',
      })
      .populate({
        path: 'hackathonId',
        select: 'title',
      })
      .populate({
        path: 'submittedBy',
        select: 'name email',
      });
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    res.json({ submission });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submission', details: err.message });
  }
};