// controllers/submissionFormController.js
const Hackathon = require("../model/HackathonModel");
const Project = require("../model/ProjectModel");
const Submission = require("../model/SubmissionModel");
const Team = require('../model/TeamModel');
const JudgeAssignment = require("../model/JudgeAssignmentModel");
const Score = require('../model/ScoreModel');

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

    // Get hackathon details for deadline checking
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    // Check deadline conditions
    const now = new Date();
    let deadlinePassed = false;
    let deadlineMessage = "";

    if (roundIndex !== undefined && roundIndex >= 0 && hackathon.rounds && hackathon.rounds[roundIndex]) {
      // Check round-specific deadline
      const round = hackathon.rounds[roundIndex];
      if (round.endDate && now > new Date(round.endDate)) {
        deadlinePassed = true;
        deadlineMessage = new Date(round.endDate).toLocaleString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata"
        });
      }
    } else if (hackathon.submissionDeadline && now > new Date(hackathon.submissionDeadline)) {
      // Check general submission deadline
      deadlinePassed = true;
      deadlineMessage = new Date(hackathon.submissionDeadline).toLocaleString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata"
      });
    }

    if (deadlinePassed) {
      return res.status(400).json({ 
        error: `The hackathon submission window is closed. The deadline was ${deadlineMessage}.` 
      });
    }

    // Check if this is Round 2 submission and validate shortlisting
    if (roundIndex === 1) { // Round 2 (index 1 in rounds array)
      // Check if the user or their team was shortlisted for Round 2
      let isShortlisted = false;
      
      // First check if user is part of a team
      const userTeam = await Team.findOne({ hackathon: hackathonId, members: userId, status: 'active' });
      
      if (userTeam) {
        // Check if team is in hackathon's shortlisted teams for Round 2
        const roundProgress = hackathon.roundProgress?.find(rp => rp.roundIndex === 0); // Round 1 progress
        if (roundProgress && roundProgress.shortlistedTeams) {
          isShortlisted = roundProgress.shortlistedTeams.includes(userTeam._id.toString());
        }
        
        // Check for team shortlisted submissions
        if (!isShortlisted) {
          const shortlistedSubmission = await Submission.findOne({
            hackathonId,
            teamName: userTeam.name,
            shortlistedForRound: 2,
            status: 'shortlisted'
          });
          isShortlisted = !!shortlistedSubmission;
        }
        
        // Also check for individual submissions by team members
        if (!isShortlisted) {
          const shortlistedSubmission = await Submission.findOne({
            hackathonId,
            submittedBy: userId,
            shortlistedForRound: 2,
            status: 'shortlisted'
          });
          isShortlisted = !!shortlistedSubmission;
        }
      } else {
        // Check if user is individually shortlisted
        const roundProgress = hackathon.roundProgress?.find(rp => rp.roundIndex === 0); // Round 1 progress
        if (roundProgress && roundProgress.shortlistedTeams) {
          isShortlisted = roundProgress.shortlistedTeams.includes(userId.toString());
        }
        
        // Check for individual shortlisted submissions
        if (!isShortlisted) {
          const shortlistedSubmission = await Submission.findOne({
            hackathonId,
            submittedBy: userId,
            shortlistedForRound: 2,
            status: 'shortlisted'
          });
          isShortlisted = !!shortlistedSubmission;
        }
      }
      
      if (!isShortlisted) {
        return res.status(403).json({ 
          error: "Your team was not shortlisted for Round 2. Only shortlisted teams can submit to Round 2." 
        });
      }
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
    const userSubmissionCount = await Submission.countDocuments({
      hackathonId,
      submittedBy: userId,
      projectId: { $exists: true, $ne: null }
    });
    if (userSubmissionCount >= (hackathon.maxSubmissionsPerParticipant || 1)) {
      return res.status(400).json({ error: `You have reached the maximum number of submissions (${hackathon.maxSubmissionsPerParticipant || 1}) for this hackathon.` });
    }

    // Find the user's team for this hackathon
    let teamName = '-';
    const team = await Team.findOne({ hackathon: hackathonId, members: userId, status: 'active' });
    if (team) teamName = team.name;

    // Delete any existing submissions for this user and hackathon before creating new one
    const existingSubmissions = await Submission.find({ 
      hackathonId, 
      submittedBy: userId,
      projectId: { $exists: true, $ne: null } // Only delete project submissions, not PPT submissions
    });
    
    if (existingSubmissions.length > 0) {
      console.log(`🗑️ Deleting ${existingSubmissions.length} existing submissions for user ${userId} in hackathon ${hackathonId}`);
      
      // Delete existing submissions
      await Submission.deleteMany({ 
        hackathonId, 
        submittedBy: userId,
        projectId: { $exists: true, $ne: null }
      });
      
      // Reset project statuses back to draft
      const projectIds = existingSubmissions.map(sub => sub.projectId).filter(Boolean);
      if (projectIds.length > 0) {
        await Project.updateMany(
          { _id: { $in: projectIds } },
          {
            status: 'draft',
            $unset: { hackathon: '', submittedAt: '' }
          }
        );
      }
    }

    // Create new submission
    console.log('[DEBUG] Creating submission (project):', { hackathonId, projectId, userId, problemStatement });
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
      teamName,
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
    const { hackathonId, roundIndex, pptFile, originalName, problemStatement } = req.body;
    const userId = req.user._id;
    if (!hackathonId || typeof roundIndex !== 'number' || !pptFile) {
      return res.status(400).json({ success: false, error: 'hackathonId, roundIndex, and pptFile are required' });
    }
    
    // Check registration
    const Registration = require("../model/HackathonRegistrationModel");
    const isRegistered = await Registration.findOne({ hackathonId, userId });
    if (!isRegistered) {
      return res.status(400).json({ 
        error: "You must be registered for this hackathon to submit a PPT. Please register first and then try submitting again." 
      });
    }

    // Get hackathon details for deadline checking
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ error: "Hackathon not found" });
    }

    // Check deadline conditions
    const now = new Date();
    let deadlinePassed = false;
    let deadlineMessage = "";

    if (hackathon.submissionDeadline && now > new Date(hackathon.submissionDeadline)) {
      deadlinePassed = true;
      deadlineMessage = "Submission deadline has passed";
    }

    if (deadlinePassed) {
      return res.status(400).json({ error: deadlineMessage });
    }

    // Check if user has reached the max submissions for this hackathon
    const userSubmissionCount = await Submission.countDocuments({
      hackathonId,
      submittedBy: userId,
      pptFile: { $exists: true, $ne: null }
    });
    if (userSubmissionCount >= (hackathon.maxSubmissionsPerParticipant || 1)) {
      return res.status(400).json({ error: `You have reached the maximum number of PPT submissions (${hackathon.maxSubmissionsPerParticipant || 1}) for this hackathon.` });
    }

      // Find the user's team for this hackathon
      let teamName = '-';
      const team = await Team.findOne({ hackathon: hackathonId, members: userId, status: 'active' });
      if (team) teamName = team.name;

    // Check if there's already a PPT submission for this user, hackathon, and round
    let submission = await Submission.findOne({ 
      hackathonId, 
      submittedBy: userId, 
      roundIndex,
      pptFile: { $exists: true, $ne: null }
    });

    // Delete any existing PPT submissions for this user, hackathon, and round
    if (submission) {
      console.log(`🗑️ Deleting existing PPT submission for user ${userId} in hackathon ${hackathonId} round ${roundIndex}`);
      await Submission.findByIdAndDelete(submission._id);
      submission = null; // Reset to null so we create a new one
    }

      // Create new submission
      console.log('[DEBUG] Creating submission (ppt):', { hackathonId, roundIndex, userId, problemStatement });
      submission = await Submission.create({
        hackathonId,
        roundIndex,
        pptFile,
        originalName,
        submittedBy: userId,
        status: 'submitted',
        submittedAt: new Date(),
        teamName,
        problemStatement,
      });
      return res.status(200).json({ success: true, submission, replaced: false });
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
    console.log('[deletePPTSubmission] Deleted PPT submission:', submission);
    res.status(200).json({ success: true, deleted: submission });
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
    const deleted = await Submission.findByIdAndDelete(id);
    console.log('[deleteSubmissionById] Deleted submission:', deleted);
    // If the submission had a projectId, set its status back to 'draft'
    if (deleted && deleted.projectId) {
      await Project.findByIdAndUpdate(deleted.projectId, {
        status: 'draft',
        $unset: { hackathon: '', submittedAt: '' }
      });
    }
    res.json({ success: true, message: 'Submission deleted', deleted });
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
      
      // Check if this project is already submitted to this hackathon by this user
      const alreadySubmitted = await Submission.findOne({
        hackathonId: submission.hackathonId._id,
        projectId,
        submittedBy: userId,
        _id: { $ne: id },
      });
      if (alreadySubmitted) {
        return res.status(400).json({ error: 'This project is already submitted to this hackathon' });
      }
      
      // Delete the old submission and create a new one with the new project
      console.log(`🔄 Changing project from ${submission.projectId} to ${projectId} for submission ${id}`);
      
      // Delete the old submission
      await Submission.findByIdAndDelete(id);
      
      // Create a new submission with the new project
      const newSubmission = await Submission.create({
        hackathonId: submission.hackathonId._id,
        projectId: projectId,
        submittedBy: userId,
        problemStatement: problemStatement || submission.problemStatement,
        customAnswers: customAnswers || submission.customAnswers,
        selectedMembers: selectedMembers || submission.selectedMembers,
        status: 'submitted',
        teamName: submission.teamName,
        roundIndex: submission.roundIndex,
        submittedAt: new Date()
      });
      
      // Update the new project status
      await Project.findByIdAndUpdate(projectId, {
        status: 'submitted',
        hackathon: submission.hackathonId._id,
        submittedAt: new Date(),
      });
      
      // Reset the old project status
      await Project.findByIdAndUpdate(submission.projectId, {
        status: 'draft',
        $unset: { hackathon: '', submittedAt: '' }
      });
      
      // Populate and return the new submission
      await newSubmission.populate('projectId');
      return res.json({ success: true, submission: newSubmission, message: 'Submission updated with new project' });
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
        select: 'title description technologies links attachments repoLink websiteLink videoLink socialLinks logo category customCategory team submittedBy hackathon scores status submittedAt oneLineIntro skills teamIntro customAnswers createdAt likes likedBy views viewedBy images',
        populate: [
          { path: 'team', populate: [ { path: 'members', select: 'name profileImage email' }, { path: 'leader', select: 'name profileImage email' } ] },
          { path: 'submittedBy', select: 'name profileImage email' }
        ]
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
    let submission = await Submission.findById(id)
      .populate({
        path: 'projectId',
        select: 'title description repoLink websiteLink videoLink socialLinks logo category customCategory team submittedBy hackathon scores status submittedAt oneLineIntro skills teamIntro customAnswers createdAt likes likedBy views viewedBy attachments files',
        populate: [
          { path: 'team', populate: [ { path: 'members', select: 'name profileImage email' }, { path: 'leader', select: 'name profileImage email' } ] },
          { path: 'submittedBy', select: 'name profileImage email' },
          { path: 'hackathon', select: 'title' },
        ]
      })
      .populate({
        path: 'hackathonId',
        select: 'title',
      })
      .populate({
        path: 'submittedBy',
        select: 'name email',
      })
      .populate({
        path: 'teamId',
        select: 'name leader',
        populate: { path: 'leader', select: 'name email' }
      });
    if (!submission) return res.status(404).json({ error: 'Submission not found' });
    // Attach teamName and leaderName for frontend
    let teamName = submission.teamName;
    let leaderName = null;
    if (submission.teamId && typeof submission.teamId === 'object') {
      teamName = submission.teamId.name || teamName;
      if (submission.teamId.leader && typeof submission.teamId.leader === 'object') {
        leaderName = submission.teamId.leader.name || submission.teamId.leader.email;
      }
    }
    // If leaderName is still null, try to find the team by hackathonId and submittedBy
    if (!leaderName && submission.hackathonId && submission.submittedBy) {
      const team = await Team.findOne({ hackathon: submission.hackathonId._id || submission.hackathonId, members: submission.submittedBy._id || submission.submittedBy, status: 'active' }).populate('leader', 'name email');
      if (team && team.leader) {
        leaderName = team.leader.name || team.leader.email;
        if (!teamName) teamName = team.name;
      }
    }
    // Fallback to submittedBy name/email if still not found
    if (!leaderName && submission.submittedBy) {
      leaderName = submission.submittedBy.name || submission.submittedBy.email;
    }
    const submissionObj = submission.toObject();
    submissionObj.teamName = teamName;
    submissionObj.leaderName = leaderName;
    submissionObj.problemStatement = submission.problemStatement;
    console.log('[DEBUG] getSubmissionByIdAdmin:', { id, problemStatement: submission.problemStatement, submissionObj });
    res.json({ submission: submissionObj });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submission', details: err.message });
  }
};

// Like a PPT submission
exports.likeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id?.toString();
    if (!userId) return res.status(401).json({ message: 'You must be logged in to like submissions.' });
    const submission = await Submission.findById(id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    const hasLiked = submission.likedBy.map(String).includes(userId);
    if (hasLiked) {
      submission.likes = Math.max(0, submission.likes - 1);
      submission.likedBy = submission.likedBy.filter(l => String(l) !== userId);
      await submission.save();
      return res.status(200).json({ liked: false, likes: submission.likes, message: 'Like removed.' });
    }
    submission.likes++;
    submission.likedBy.push(userId);
    await submission.save();
    res.status(200).json({ liked: true, likes: submission.likes, message: 'Submission liked!' });
  } catch (err) {
    res.status(500).json({ message: 'Error liking submission', error: err.message });
  }
};

// View a PPT submission
exports.viewSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id?.toString();
    if (!userId) return res.status(401).json({ message: 'You must be logged in to view submissions.' });
    const submission = await Submission.findById(id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    if (!submission.viewedBy.map(String).includes(userId)) {
      submission.views++;
      submission.viewedBy.push(userId);
      await submission.save();
    }
    res.status(200).json({ views: submission.views });
  } catch (err) {
    res.status(500).json({ message: 'Error incrementing view', error: err.message });
  }
};
exports.getSubmissionsForJudge = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const judgeId = req.user.id;

    // Find all team assignments for this judge in this hackathon
    const assignments = await JudgeAssignment.find({ hackathonId, judge: judgeId });
    const assignedTeamIds = assignments.flatMap(a => a.teamIds || []);

    // If no teams assigned
    if (assignedTeamIds.length === 0) {
      return res.status(200).json({ submissions: [] });
    }

    // Fetch submissions for the assigned teams
    const submissions = await Submission.find({
      hackathonId,
      team: { $in: assignedTeamIds },
      status: "submitted"
    })
      .populate("projectId")
      .populate("team")
      .populate("submittedBy");

    return res.status(200).json({ submissions });

  } catch (error) {
    console.error("Error in getSubmissionsForJudge:", error);
    return res.status(500).json({ message: "Failed to fetch submissions." });
  }
};

// Get all judge evaluations for a submission (for organizer view)
exports.getJudgeEvaluationsForSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const scores = await Score.find({ submission: id })
      .populate({ path: 'judge', select: 'name email' });
    if (!scores.length) return res.json({ evaluations: [], averages: null });
    // Calculate averages
    const total = { innovation: 0, impact: 0, technicality: 0, presentation: 0 };
    scores.forEach(s => {
      total.innovation += s.scores.innovation;
      total.impact += s.scores.impact;
      total.technicality += s.scores.technicality;
      total.presentation += s.scores.presentation;
    });
    const count = scores.length;
    const averages = {
      innovation: +(total.innovation / count).toFixed(2),
      impact: +(total.impact / count).toFixed(2),
      technicality: +(total.technicality / count).toFixed(2),
      presentation: +(total.presentation / count).toFixed(2),
      overall: +((total.innovation + total.impact + total.technicality + total.presentation) / (count * 4)).toFixed(2)
    };
    res.json({
      evaluations: scores.map(s => ({
        judge: s.judge,
        scores: s.scores,
        feedback: s.feedback,
        createdAt: s.createdAt
      })),
      averages
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch judge evaluations', details: err.message });
  }
};

// GET /api/submission-form/admin/hackathon/:hackathonId/with-problem-statements
const getSubmissionsWithProblemStatements = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    
    // Get all submissions for this hackathon
    const submissions = await Submission.find({ hackathonId })
      .populate('submittedBy', 'name email')
      .populate('projectId', 'title description')
      .populate('hackathonId', 'title problemStatements')
      .sort({ submittedAt: -1 });

    // Process submissions to include problem statement and round information
    const processedSubmissions = submissions.map(sub => {
      const submissionType = sub.pptFile ? 'PPT' : 'Project';
      const roundNumber = sub.roundIndex || (sub.pptFile ? 2 : 1); // PPT is usually round 2, Project is round 1
      
      return {
        _id: sub._id,
        id: sub._id,
        hackathonId: sub.hackathonId,
        projectId: sub.projectId,
        submittedBy: sub.submittedBy,
        problemStatement: sub.problemStatement,
        customAnswers: sub.customAnswers,
        status: sub.status,
        submittedAt: sub.submittedAt,
        selectedMembers: sub.selectedMembers,
        pptFile: sub.pptFile,
        originalName: sub.originalName,
        roundIndex: sub.roundIndex,
        teamName: sub.teamName,
        // Add processed fields
        submissionType,
        roundNumber,
        roundLabel: `Round ${roundNumber}`,
        projectTitle: sub.projectId?.title || sub.originalName || 'PPT Submission',
        submittedByName: sub.submittedBy?.name || 'Unknown',
        submittedByEmail: sub.submittedBy?.email || 'Unknown'
      };
    });

    // Calculate analytics with problem statement breakdown
    const problemStatementStats = {};
    const roundStats = { 1: 0, 2: 0 };
    
    processedSubmissions.forEach(sub => {
      // Count by problem statement
      if (sub.problemStatement) {
        if (!problemStatementStats[sub.problemStatement]) {
          problemStatementStats[sub.problemStatement] = { total: 0, round1: 0, round2: 0 };
        }
        problemStatementStats[sub.problemStatement].total++;
        if (sub.roundNumber === 1) {
          problemStatementStats[sub.problemStatement].round1++;
        } else if (sub.roundNumber === 2) {
          problemStatementStats[sub.problemStatement].round2++;
        }
      }
      
      // Count by round
      roundStats[sub.roundNumber] = (roundStats[sub.roundNumber] || 0) + 1;
    });

    const analytics = {
      totalSubmissions: processedSubmissions.length,
      roundStats,
      problemStatementStats: Object.entries(problemStatementStats).map(([ps, stats]) => ({
        problemStatement: ps,
        totalCount: stats.total,
        round1Count: stats.round1,
        round2Count: stats.round2
      })).sort((a, b) => b.totalCount - a.totalCount)
    };

    res.json({
      submissions: processedSubmissions,
      analytics
    });
  } catch (err) {
    console.error('Error fetching submissions with problem statements:', err);
    res.status(500).json({ error: 'Failed to fetch submissions with problem statements', details: err.message });
  }
};

exports.getSubmissionsWithProblemStatements = getSubmissionsWithProblemStatements;
