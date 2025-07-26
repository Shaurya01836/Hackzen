const JudgeAssignment = require('../model/JudgeAssignmentModel');
const Hackathon = require('../model/HackathonModel');
const User = require('../model/UserModel');
const RoleInvite = require('../model/RoleInviteModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Submission = require('../model/SubmissionModel');
const Score = require('../model/ScoreModel');
const mongoose = require('mongoose');

// 🎯 Add Problem Statements to Hackathon
exports.addProblemStatements = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const { problemStatements } = req.body;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Verify organizer permissions
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can add problem statements' });
    }

    // Validate problem statements
    if (!Array.isArray(problemStatements) || problemStatements.length === 0) {
      return res.status(400).json({ message: 'At least one problem statement is required' });
    }

    // Update hackathon with new problem statements
    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      hackathonId,
      {
        $push: {
          problemStatements: {
            $each: problemStatements.map(ps => ({
              statement: ps.statement,
              type: ps.type,
              sponsorCompany: ps.sponsorCompany || null,
              isSponsored: ps.type === 'sponsored'
            }))
          }
        }
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Problem statements added successfully',
      hackathon: updatedHackathon
    });

  } catch (error) {
    console.error('Error adding problem statements:', error);
    res.status(500).json({ message: 'Failed to add problem statements' });
  }
};

// 🎯 Assign Judges to Problem Statements
exports.assignJudges = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const { judgeAssignments } = req.body;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Verify organizer permissions
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can assign judges' });
    }

    const results = [];

    for (const assignment of judgeAssignments) {
      let { 
        judgeEmail, 
        judgeType, 
        sponsorCompany, 
        canJudgeSponsoredPS, 
        maxSubmissionsPerJudge, 
        sendEmail = true,
        firstName,
        lastName,
        mobile
      } = assignment;

      // Check if assignment already exists for this judge and hackathon
      const existing = await JudgeAssignment.findOne({
        hackathon: hackathonId,
        'judge.email': judgeEmail
      });
      
      if (existing) {
        results.push({
          judgeEmail,
          success: false,
          error: 'Judge already invited to this hackathon'
        });
        continue;
      }

      // Create assignedRounds for each hackathon round, with assignedSubmissions: []
      const assignedRounds = (hackathon.rounds || []).map((round, idx) => ({
        roundIndex: idx,
        roundId: round._id?.toString() || `round_${idx}`,
        roundName: round.name || `Round #${idx + 1}`,
        roundType: round.type || 'project',
        isAssigned: true,
        assignedSubmissions: [],
        maxSubmissions: 50
      }));

      // Create judge assignment
      const judgeAssignment = await JudgeAssignment.create({
        hackathon: hackathonId,
        judge: {
          email: judgeEmail,
          name: firstName && lastName ? `${firstName} ${lastName}` : firstName || judgeEmail.split('@')[0],
          type: judgeType,
          sponsorCompany: judgeType === 'sponsor' ? sponsorCompany : null,
          canJudgeSponsoredPS: judgeType === 'hybrid' || (judgeType === 'platform' && canJudgeSponsoredPS)
        },
        assignedProblemStatements: [],
        assignedRounds,
        permissions: {
          canJudgeGeneralPS: judgeType !== 'sponsor',
          canJudgeSponsoredPS: judgeType === 'sponsor' || judgeType === 'hybrid' || canJudgeSponsoredPS,
          canJudgeAllRounds: true,
          maxSubmissionsPerJudge: maxSubmissionsPerJudge || 50
        },
        assignedBy: req.user.id,
        status: 'pending',
        invitation: {
          sentAt: sendEmail ? new Date() : null
        }
      });

      // === Unified RoleInvite System ===
      let invite = await RoleInvite.findOne({
        email: judgeEmail,
        hackathon: hackathonId,
        role: 'judge',
        status: 'pending'
      });
      
      if (!invite) {
        const token = crypto.randomBytes(32).toString('hex');
        invite = await RoleInvite.create({
          email: judgeEmail,
          hackathon: hackathonId,
          role: 'judge',
          token,
          metadata: {
            firstName,
            lastName,
            mobile,
            judgeType,
            sponsorCompany
          }
        });
        
        if (sendEmail) {
          await sendRoleInviteEmail(judgeEmail, 'judge', token, hackathon);
        }
      } else {
        console.log(`Judge invite already exists for: ${judgeEmail}`);
      }

      results.push({
        judgeEmail,
        success: true,
        assignmentId: judgeAssignment._id,
        status: 'pending'
      });
    }

    res.status(200).json({
      message: 'Judge assignments processed',
      results
    });

  } catch (error) {
    console.error('Error assigning judges:', error);
    res.status(500).json({ message: 'Failed to assign judges' });
  }
};

// 🎯 Get Judge Assignments for Hackathon
exports.getJudgeAssignments = async (req, res) => {
  try {
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Verify organizer permissions
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can view judge assignments' });
    }

    const assignments = await JudgeAssignment.find({ hackathon: hackathonId })
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    // Group assignments by judge type
    const groupedAssignments = {
      platform: assignments.filter(a => a.judge.type === 'platform'),
      sponsor: assignments.filter(a => a.judge.type === 'sponsor'),
      hybrid: assignments.filter(a => a.judge.type === 'hybrid')
    };

    res.status(200).json({
      hackathon: {
        id: hackathon._id,
        title: hackathon.title,
        problemStatements: hackathon.problemStatements,
        rounds: hackathon.rounds
      },
      assignments: groupedAssignments,
      summary: {
        total: assignments.length,
        platform: groupedAssignments.platform.length,
        sponsor: groupedAssignments.sponsor.length,
        hybrid: groupedAssignments.hybrid.length,
        active: assignments.filter(a => a.status === 'active').length,
        pending: assignments.filter(a => a.status === 'pending').length
      }
    });

  } catch (error) {
    console.error('Error fetching judge assignments:', error);
    res.status(500).json({ message: 'Failed to fetch judge assignments' });
  }
};

// 🎯 Update Judge Assignment
exports.updateJudgeAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const updates = req.body;

    const assignment = await JudgeAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Judge assignment not found' });
    }

    // Verify organizer permissions
    const hackathon = await Hackathon.findById(assignment.hackathon);
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can update judge assignments' });
    }

    // Validate updates
    if (updates.judge && updates.judge.type) {
      const validationResult = validateJudgeTypeChange(
        assignment.judge.type,
        updates.judge.type,
        updates.judge.sponsorCompany
      );
      if (!validationResult.isValid) {
        return res.status(400).json({ message: validationResult.error });
      }
    }

    // Update assignment
    const updatedAssignment = await JudgeAssignment.findByIdAndUpdate(
      assignmentId,
      updates,
      { new: true }
    ).populate('assignedBy', 'name email');

    res.status(200).json({
      message: 'Judge assignment updated successfully',
      assignment: updatedAssignment
    });

  } catch (error) {
    console.error('Error updating judge assignment:', error);
    res.status(500).json({ message: 'Failed to update judge assignment' });
  }
};

// 🎯 Remove Judge Assignment
exports.removeJudgeAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await JudgeAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Judge assignment not found' });
    }

    // Verify organizer permissions
    const hackathon = await Hackathon.findById(assignment.hackathon);
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can remove judge assignments' });
    }

    // Check if judge has already started judging
    if (assignment.metrics.totalSubmissionsJudged > 0) {
      return res.status(400).json({ 
        message: 'Cannot remove judge who has already started judging submissions' 
      });
    }

    // Remove judge email from hackathon's judges array
    await Hackathon.findByIdAndUpdate(
      assignment.hackathon,
      { $pull: { judges: assignment.judge.email } }
    );

    // Remove any RoleInvite for this judge (so they can be re-invited and don't see the hackathon)
    await RoleInvite.deleteMany({
      email: assignment.judge.email,
      hackathon: assignment.hackathon,
      role: 'judge'
    });

    await JudgeAssignment.findByIdAndDelete(assignmentId);

    res.status(200).json({
      message: 'Judge assignment and invite removed successfully'
    });

  } catch (error) {
    console.error('Error removing judge assignment:', error);
    res.status(500).json({ message: 'Failed to remove judge assignment' });
  }
};

// 🎯 Get Available Judges for Problem Statement
exports.getAvailableJudgesForProblemStatement = async (req, res) => {
  try {
    const { hackathonId, problemStatementId } = req.params;
    
    // Verify hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    const problemStatement = hackathon.problemStatements.find(
      ps => ps._id.toString() === problemStatementId
    );
    if (!problemStatement) {
      return res.status(404).json({ message: 'Problem statement not found' });
    }

    // Get all judge assignments for this hackathon
    const assignments = await JudgeAssignment.find({ hackathon: hackathonId });

    // Filter judges who can judge this problem statement
    const availableJudges = assignments.filter(assignment => {
      if (problemStatement.type === 'general') {
        return assignment.permissions.canJudgeGeneralPS;
      } else if (problemStatement.type === 'sponsored') {
        if (assignment.judge.type === 'sponsor') {
          return assignment.judge.sponsorCompany === problemStatement.sponsorCompany;
        } else if (assignment.judge.type === 'hybrid') {
          return assignment.permissions.canJudgeSponsoredPS;
        } else if (assignment.judge.type === 'platform' && assignment.judge.canJudgeSponsoredPS) {
          return assignment.permissions.canJudgeSponsoredPS;
        }
      }
      return false;
    });

    res.status(200).json({
      problemStatement,
      availableJudges: availableJudges.map(judge => ({
        email: judge.judge.email,
        name: judge.judge.name,
        type: judge.judge.type,
        sponsorCompany: judge.judge.sponsorCompany,
        metrics: judge.metrics,
        status: judge.status
      }))
    });
  } catch (error) {
    console.error('Error fetching available judges:', error);
    res.status(500).json({ message: 'Failed to fetch available judges' });
  }
};

// 🎯 Get All Available Judges for Hackathon
exports.getAvailableJudges = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    
    // Verify hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Check if user is organizer or admin
    if (hackathon.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to manage this hackathon' });
    }

    const User = require('../model/UserModel');
    const allJudges = await User.find({ 
      role: 'judge',
      profileCompleted: true 
    }).select('name email profileImage');
    
    const existingAssignments = await JudgeAssignment.find({ 
      hackathon: hackathonId 
    }).select('judge.email');
    
    const existingJudgeEmails = existingAssignments.map(assignment => assignment.judge.email);
    const availableJudges = allJudges.filter(judge => 
      !existingJudgeEmails.includes(judge.email)
    );

    const formattedJudges = availableJudges.map(judge => ({
      id: judge._id,
      name: judge.name || judge.email.split('@')[0],
      email: judge.email,
      profileImage: judge.profileImage,
      type: 'external', // Default type for available judges
      status: 'available',
      assignedSubmissions: 0,
      maxSubmissions: 10 
    }));

    res.status(200).json({
      evaluators: formattedJudges,
      total: formattedJudges.length,
      available: formattedJudges.length,
      assigned: existingJudgeEmails.length
    });
  } catch (error) {
    console.error('Error fetching available judges:', error);
    res.status(500).json({ message: 'Failed to fetch available judges' });
  }
};

// 🎯 Invite Judge to Hackathon
exports.inviteJudge = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const { judgeEmail, judgeType = 'external', maxSubmissionsPerJudge = 10 } = req.body;

    // Validate input
    if (!judgeEmail || !judgeEmail.includes('@')) {
      return res.status(400).json({ message: 'Valid judge email is required' });
    }

    // Verify hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Check if user is organizer or admin
    if (hackathon.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to manage this hackathon' });
    }

    // Check if judge exists
    const judge = await User.findOne({ email: judgeEmail });
    if (!judge) {
      return res.status(404).json({ message: 'Judge not found. User must be registered first.' });
    }

    // Check if judge is already assigned to this hackathon
    const existingAssignment = await JudgeAssignment.findOne({
      hackathon: hackathonId,
      'judge.email': judgeEmail
    });

    if (existingAssignment) {
      return res.status(400).json({ message: 'Judge is already assigned to this hackathon' });
    }

    // Create assignedRounds for each hackathon round, with assignedSubmissions: []
    const assignedRounds = (hackathon.rounds || []).map((round, idx) => ({
      roundIndex: idx,
      roundId: round._id?.toString() || `round_${idx}`,
      roundName: round.name || `Round #${idx + 1}`,
      roundType: round.type || 'project',
      isAssigned: true,
      assignedSubmissions: [],
      maxSubmissions: 50
    }));

    // Create judge assignment
    const assignment = new JudgeAssignment({
      hackathon: hackathonId,
      judge: {
        _id: judge._id,
        name: judge.name || judge.email.split('@')[0],
        email: judge.email,
        type: judgeType,
        profileImage: judge.profileImage
      },
      status: 'pending',
      maxSubmissionsPerJudge,
      assignedRounds,
      assignedTeams: []
    });

    await assignment.save();

    // TODO: Send invitation email to judge
    // This would typically involve sending an email with a link to accept/decline the invitation

    res.status(201).json({
      message: 'Judge invited successfully',
      assignment: {
        _id: assignment._id,
        judge: assignment.judge,
        status: assignment.status,
        maxSubmissionsPerJudge: assignment.maxSubmissionsPerJudge
      }
    });

  } catch (error) {
    console.error('Error inviting judge:', error);
    res.status(500).json({ message: 'Failed to invite judge' });
  }
};

// 🎯 Accept/Decline Judge Invitation
exports.respondToInvitation = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { response } = req.body; // 'accept' or 'decline'

    const assignment = await JudgeAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Judge assignment not found' });
    }

    if (assignment.judge.email !== req.user.email) {
      return res.status(403).json({ message: 'You can only respond to your own invitations' });
    }

    if (response === 'accept') {
      assignment.status = 'active';
      assignment.invitation.acceptedAt = new Date();
      
      // Create role invite for the judge
      await RoleInvite.create({
        hackathon: assignment.hackathon,
        invitedUser: req.user.id,
        role: 'judge',
        status: 'accepted',
        invitedBy: assignment.assignedBy
      });

    } else if (response === 'decline') {
      assignment.status = 'removed';
      assignment.invitation.declinedAt = new Date();
    }

    await assignment.save();

    res.status(200).json({
      message: `Invitation ${response}ed successfully`,
      assignment
    });

  } catch (error) {
    console.error('Error responding to invitation:', error);
    res.status(500).json({ message: 'Failed to respond to invitation' });
  }
};

// 🎯 Get Judge Assignment Details
exports.getJudgeAssignmentDetails = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await JudgeAssignment.findById(assignmentId)
      .populate('hackathon', 'title description startDate endDate problemStatements rounds')
      .populate('assignedBy', 'name email');

    if (!assignment) {
      return res.status(404).json({ message: 'Judge assignment not found' });
    }

    res.status(200).json({
      assignment,
      hackathon: assignment.hackathon
    });

  } catch (error) {
    console.error('Error fetching judge assignment details:', error);
    res.status(500).json({ message: 'Failed to fetch assignment details' });
  }
};

// 🎯 Get Judge Dashboard Data
exports.getJudgeDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all judge assignments for this user
    const assignments = await JudgeAssignment.find({
      'judge.email': req.user.email,
      status: { $in: ['active', 'pending'] }
    }).populate('hackathon', 'title startDate endDate status');

    // Get performance metrics
    const totalSubmissionsJudged = assignments.reduce(
      (sum, assignment) => sum + assignment.metrics.totalSubmissionsJudged, 0
    );

    const totalTimeSpent = assignments.reduce(
      (sum, assignment) => sum + assignment.metrics.totalTimeSpent, 0
    );

    const averageScore = assignments.length > 0 
      ? assignments.reduce((sum, assignment) => sum + assignment.metrics.averageScoreGiven, 0) / assignments.length
      : 0;

    res.status(200).json({
      assignments,
      metrics: {
        totalHackathons: assignments.length,
        totalSubmissionsJudged,
        totalTimeSpent,
        averageScore: averageScore.toFixed(1)
      }
    });

  } catch (error) {
    console.error('Error fetching judge dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch judge dashboard' });
  }
};

// Assign specific teams to a judge assignment
exports.assignTeamsToJudge = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { teamIds } = req.body;

    const assignment = await JudgeAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Judge assignment not found' });
    }

    // Organizer permission check
    const hackathon = await Hackathon.findById(assignment.hackathon);
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can assign teams' });
    }

    // Validate teamIds: Ensure it's an array. An empty array is now allowed for unassignment.
    if (!Array.isArray(teamIds)) {
      return res.status(400).json({ message: 'teamIds must be an array' });
    }
    
    // If teamIds is empty, it means unassign all. No further validation needed for invalidIds.
    if (teamIds.length > 0) {
      const validTeamIds = hackathon.teams.map(id => id.toString());
      const invalidIds = teamIds.filter(id => !validTeamIds.includes(id));
      if (invalidIds.length > 0) {
        return res.status(400).json({ message: 'Some teamIds are invalid', invalidIds });
      }
    }

    // Optionally: Prevent duplicate team assignment to multiple judges in assigned mode
    // This check should only apply when adding teams, not when clearing all teams.
    if (teamIds.length > 0) { 
      const allAssignments = await JudgeAssignment.find({ hackathon: hackathon._id });
      const alreadyAssigned = [];
      for (const teamId of teamIds) {
        for (const other of allAssignments) {
          // Only check other assignments, and ensure the team isn't already assigned to *this* judge
          if (other._id.toString() !== assignmentId && Array.isArray(other.assignedTeams) && other.assignedTeams.map(String).includes(teamId)) {
            alreadyAssigned.push(teamId);
          }
        }
      }
      if (alreadyAssigned.length > 0) {
        return res.status(400).json({ message: 'Some teams are already assigned to other judges', alreadyAssigned });
      }
    }

    assignment.assignedTeams = teamIds; // This will now correctly set to [] if teamIds is empty
    await assignment.save();

    res.status(200).json({ message: 'Teams assigned to judge successfully', assignment });
  } catch (error) {
    console.error('Error assigning teams to judge:', error);
    res.status(500).json({ message: 'Failed to assign teams to judge' });
  }
};

// Unassign judge from a specific problem statement or round in a JudgeAssignment
exports.unassignScopeFromJudge = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { problemStatementId, roundId } = req.body;

    const assignment = await JudgeAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Judge assignment not found' });
    }

    // Organizer permission check
    const hackathon = await Hackathon.findById(assignment.hackathon);
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can unassign judges' });
    }

    let changed = false;
    if (problemStatementId) {
      const before = assignment.assignedProblemStatements.length;
      assignment.assignedProblemStatements = assignment.assignedProblemStatements.filter(
        ps => String(ps.problemStatementId) !== String(problemStatementId)
      );
      if (assignment.assignedProblemStatements.length !== before) changed = true;
    }
    if (roundId) {
      const before = assignment.assignedRounds.length;
      assignment.assignedRounds = assignment.assignedRounds.filter(
        r => String(r.roundId) !== String(roundId)
      );
      if (assignment.assignedRounds.length !== before) changed = true;
    }
    if (!changed) {
      return res.status(400).json({ message: 'Nothing to unassign' });
    }
    // If both arrays are empty, delete the assignment
    if (assignment.assignedProblemStatements.length === 0 && assignment.assignedRounds.length === 0) {
      await JudgeAssignment.findByIdAndDelete(assignmentId);
      return res.status(200).json({ message: 'Assignment deleted (no more scopes left)' });
    } else {
      await assignment.save();
      return res.status(200).json({ message: 'Scope unassigned from judge', assignment });
    }
  } catch (error) {
    console.error('Error unassigning scope from judge:', error);
    res.status(500).json({ message: 'Failed to unassign scope from judge' });
  }
};

// Set assignment mode for a round or problem statement
exports.setAssignmentMode = async (req, res) => {
  try {
    const { hackathonId, type, index } = req.params; // type: 'round' or 'problemStatement', index: array index
    const { mode } = req.body; // 'open' or 'assigned'

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can set assignment mode' });
    }

    if (type === 'round') {
      if (!hackathon.rounds[index]) return res.status(404).json({ message: 'Round not found' });
      hackathon.rounds[index].assignmentMode = mode;
      // If switching to open, clear assignedTeams for all judge assignments for this round
      if (mode === 'open') {
        const assignments = await JudgeAssignment.find({ hackathon: hackathonId });
        for (const a of assignments) {
          if (a.assignedRounds && a.assignedRounds.some(r => r.roundIndex === Number(index))) {
            a.assignedTeams = [];
            await a.save();
          }
        }
      }
    } else if (type === 'problemStatement') {
      if (!hackathon.problemStatements[index]) return res.status(404).json({ message: 'Problem statement not found' });
      hackathon.problemStatements[index].assignmentMode = mode;
      // If switching to open, clear assignedTeams for all judge assignments for this PS
      if (mode === 'open') {
        const assignments = await JudgeAssignment.find({ hackathon: hackathonId });
        for (const a of assignments) {
          if (a.assignedProblemStatements && a.assignedProblemStatements.some(ps => ps.problemStatementId === hackathon.problemStatements[index]._id.toString())) {
            a.assignedTeams = [];
            await a.save();
          }
        }
      }
    } else {
      return res.status(400).json({ message: 'Invalid type' });
    }

    await hackathon.save();
    res.status(200).json({ message: 'Assignment mode updated', hackathon });
  } catch (error) {
    console.error('Error setting assignment mode:', error);
    res.status(500).json({ message: 'Failed to set assignment mode' });
  }
};

// Auto-distribute teams among judges
exports.autoDistributeTeams = async (req, res) => {
  try {
    const { hackathonId, type, index } = req.params; // type: 'round' or 'problemStatement', index: array index
    const { judgeAssignmentIds, teamIds, forceOverwrite } = req.body; // Added forceOverwrite

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can auto-distribute teams' });
    }

    // Validate input
    if (!Array.isArray(judgeAssignmentIds) || judgeAssignmentIds.length === 0) {
      return res.status(400).json({ message: 'judgeAssignmentIds must be a non-empty array' });
    }
    if (!Array.isArray(teamIds) || teamIds.length === 0) {
      return res.status(400).json({ message: 'teamIds must be a non-empty array' });
    }
    const validTeamIds = hackathon.teams.map(id => id.toString());
    const invalidIds = teamIds.filter(id => !validTeamIds.includes(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({ message: 'Some teamIds are invalid', invalidIds });
    }

    // Validate judge assignments
    const judgeAssignments = await JudgeAssignment.find({ _id: { $in: judgeAssignmentIds }, hackathon: hackathonId });
    if (judgeAssignments.length !== judgeAssignmentIds.length) {
      return res.status(400).json({ message: 'Some judgeAssignmentIds are invalid' });
    }

    // Prevent duplicate team assignment to multiple judges, UNLESS forceOverwrite is true
    if (!forceOverwrite) {
      const allAssignments = await JudgeAssignment.find({ hackathon: hackathon._id });
      const alreadyAssigned = [];
      for (const teamId of teamIds) {
        for (const other of allAssignments) {
          if (Array.isArray(other.assignedTeams) && other.assignedTeams.map(String).includes(teamId)) {
            alreadyAssigned.push(teamId);
          }
        }
      }
      if (alreadyAssigned.length > 0) {
        return res.status(400).json({ message: 'Some teams are already assigned to judges', alreadyAssigned });
      }
    } else {
      // If forceOverwrite is true, clear all existing assignments for the selected judges
      for (const judgeId of judgeAssignmentIds) {
        await JudgeAssignment.findByIdAndUpdate(judgeId, { assignedTeams: [] });
      }
    }

    // Evenly distribute teams
    const assignments = {};
    judgeAssignmentIds.forEach(id => assignments[id] = []);
    let i = 0;
    for (const teamId of teamIds) {
      const judgeId = judgeAssignmentIds[i % judgeAssignmentIds.length];
      assignments[judgeId].push(teamId);
      i++;
    }

    // Update each JudgeAssignment
    for (const judgeId of judgeAssignmentIds) {
      await JudgeAssignment.findByIdAndUpdate(judgeId, { assignedTeams: assignments[judgeId] });
    }

    res.status(200).json({ message: 'Teams auto-distributed among judges', assignments });
  } catch (error) {
    console.error('Error auto-distributing teams:', error);
    res.status(500).json({ message: 'Failed to auto-distribute teams' });
  }
};

// Assign rounds to a judge assignment (additive)
exports.assignRoundsToJudge = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { roundIds } = req.body; // Array of round _id strings

    const assignment = await JudgeAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Judge assignment not found' });
    }

    // Organizer permission check
    const hackathon = await Hackathon.findById(assignment.hackathon);
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can assign rounds' });
    }

    // Validate roundIds
    if (!Array.isArray(roundIds)) {
      return res.status(400).json({ message: 'roundIds must be an array' });
    }
    const validRounds = hackathon.rounds.filter(r => roundIds.includes(r._id.toString()));
    // Merge: keep only selected rounds, remove unselected, add new
    assignment.assignedRounds = validRounds.map((r, idx) => ({
      roundIndex: hackathon.rounds.findIndex(rr => rr._id.toString() === r._id.toString()),
      roundId: r._id.toString(),
      roundName: r.name || `Round #${idx + 1}`,
      roundType: r.type || 'project',
      isAssigned: true
    }));
    // Do NOT touch assignedProblemStatements
    await assignment.save();
    res.status(200).json({ message: 'Rounds assigned to judge', assignment });
  } catch (error) {
    console.error('Error assigning rounds to judge:', error);
    res.status(500).json({ message: 'Failed to assign rounds to judge' });
  }
};

// Assign problem statements to a judge assignment (additive)
exports.assignProblemStatementsToJudge = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { problemStatementIds } = req.body; // Array of PS _id strings

    const assignment = await JudgeAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Judge assignment not found' });
    }

    // Organizer permission check
    const hackathon = await Hackathon.findById(assignment.hackathon);
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can assign problem statements' });
    }

    // Validate problemStatementIds
    if (!Array.isArray(problemStatementIds)) {
      return res.status(400).json({ message: 'problemStatementIds must be an array' });
    }
    const validPS = hackathon.problemStatements.filter(ps => problemStatementIds.includes(ps._id.toString()));
    // Merge: keep only selected PS, remove unselected, add new
    assignment.assignedProblemStatements = validPS.map(ps => ({
      problemStatementId: ps._id.toString(),
      problemStatement: ps.statement,
      type: ps.type,
      sponsorCompany: ps.sponsorCompany,
      isAssigned: true
    }));
    // Do NOT touch assignedRounds
    await assignment.save();
    res.status(200).json({ message: 'Problem statements assigned to judge', assignment });
  } catch (error) {
    console.error('Error assigning problem statements to judge:', error);
    res.status(500).json({ message: 'Failed to assign problem statements to judge' });
  }
};

// 🔧 Helper Functions

function validateJudgeAssignment(judgeType, sponsorCompany, problemStatementIds, hackathonProblemStatements) {
  // Validate judge type
  if (!['platform', 'sponsor', 'hybrid'].includes(judgeType)) {
    return { isValid: false, error: 'Invalid judge type' };
  }

  // Validate sponsor company for sponsor judges
  if (judgeType === 'sponsor' && !sponsorCompany) {
    return { isValid: false, error: 'Sponsor company is required for sponsor judges' };
  }

  // Validate problem statement assignments
  for (const psId of problemStatementIds) {
    const ps = hackathonProblemStatements.find(p => p._id.toString() === psId);
    if (!ps) {
      return { isValid: false, error: `Problem statement ${psId} not found` };
    }

    // Check if judge can judge this problem statement type
    if (ps.type === 'sponsored' && judgeType === 'platform') {
      return { isValid: false, error: 'Platform judges cannot judge sponsored problem statements by default' };
    }

    if (ps.type === 'sponsored' && judgeType === 'sponsor' && ps.sponsorCompany !== sponsorCompany) {
      return { isValid: false, error: 'Sponsor judges can only judge their own company\'s problem statements' };
    }
  }

  return { isValid: true };
}

function validateJudgeTypeChange(oldType, newType, sponsorCompany) {
  if (newType === 'sponsor' && !sponsorCompany) {
    return { isValid: false, error: 'Sponsor company is required for sponsor judges' };
  }

  return { isValid: true };
}

// Helper function to send judge/mentor invite email (copied from hackathonController.js)
async function sendRoleInviteEmail(email, role, token, hackathonData) {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) return;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  const inviteLink = `http://localhost:5173/invite/role?token=${token}`;
  const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);
  const roleIcon = role === 'judge' ? '⚖️' : '🎓';
  const roleColor = role === 'judge' ? '#f59e0b' : '#10b981';
  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, ${roleColor} 0%, #667eea 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">${roleIcon} ${roleDisplay} Invitation</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">You've been invited to be a ${roleDisplay} for an amazing hackathon!</p>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Hello there! 👋</h2>
        <p style="color: #555; line-height: 1.6;">
          You've been selected to be a <strong>${roleDisplay}</strong> for an exciting hackathon. 
          This is a great opportunity to contribute your expertise and help shape the future of innovation!
        </p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${roleColor};">
          <h3 style="color: ${roleColor}; margin: 0 0 10px 0;">🏆 ${hackathonData.title}</h3>
          <p style="color: #666; margin: 0 0 5px 0;"><strong>Role:</strong> ${roleDisplay}</p>
          <p style="color: #666; margin: 0 0 5px 0;"><strong>Prize Pool:</strong> $${hackathonData.prizePool?.amount || 0}</p>
          <p style="color: #666; margin: 0 0 5px 0;"><strong>Start Date:</strong> ${new Date(hackathonData.startDate).toLocaleDateString()}</p>
          <p style="color: #666; margin: 0;"><strong>End Date:</strong> ${new Date(hackathonData.endDate).toLocaleDateString()}</p>
        </div>
        <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #0c5460; margin: 0 0 10px 0;'>${roleDisplay} Responsibilities:</h4>
          ${role === 'judge' ? `
            <ul style="color: #0c5460; margin: 0; padding-left: 20px;">
              <li>Evaluate project submissions based on innovation, technical implementation, and presentation</li>
              <li>Provide constructive feedback to help teams improve their projects</li>
              <li>Participate in the final judging panel to select winners</li>
              <li>Contribute to a fair and transparent evaluation process</li>
            </ul>
          ` : `
            <ul style="color: #0c5460; margin: 0; padding-left: 20px;">
              <li>Provide technical guidance and mentorship to participating teams</li>
              <li>Share your expertise and industry knowledge</li>
              <li>Help teams overcome technical challenges and improve their projects</li>
              <li>Support the learning and growth of hackathon participants</li>
            </ul>
          `}
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteLink}" style="background: linear-gradient(135deg, ${roleColor} 0%, #667eea 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);">
            ${roleIcon} Accept ${roleDisplay} Role
          </a>
        </div>
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="color: #856404; margin: 0; font-size: 14px;">
            <strong>Important:</strong> You'll need to be logged in to accept this invitation. 
            If you don't have an account yet, you'll be prompted to register first.
          </p>
        </div>
        <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
          This invitation will expire in 7 days. We look forward to having you on board!
        </p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>© 2024 HackZen. All rights reserved.</p>
      </div>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: `"HackZen Team" <${process.env.MAIL_USER}>`,
      to: email,
      subject: `${roleIcon} You're invited to be a ${roleDisplay} for ${hackathonData.title}!`,
      html: emailTemplate
    });
    console.log(`Role invite email sent successfully to ${email} for ${role} role`);
  } catch (emailError) {
    console.error('Role invite email sending failed:', emailError);
  }
}

// 🎯 Bulk Assign Submissions to Evaluators
exports.bulkAssignSubmissionsToEvaluators = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const { 
      submissionIds, 
      evaluatorAssignments, 
      assignmentMode = 'manual', // 'manual' or 'equal'
      roundIndex,
      multipleJudgesMode = false,
      judgesPerProject = 1,
      judgesPerProjectMode = 'manual' // 'manual' or 'equal'
    } = req.body;



    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Defensive check for rounds and roundIndex
    if (!Array.isArray(hackathon.rounds) || typeof roundIndex !== 'number' || roundIndex < 0 || roundIndex >= hackathon.rounds.length) {
      console.error('Invalid roundIndex or hackathon.rounds:', { roundIndex, rounds: hackathon.rounds });
      return res.status(400).json({ message: 'Invalid round index for this hackathon.' });
    }

    // Defensive check for submissionIds
    if (!Array.isArray(submissionIds) || submissionIds.length === 0) {
      return res.status(400).json({ message: 'At least one submission is required' });
    }
    const invalidSubmissionIds = submissionIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidSubmissionIds.length > 0) {
      console.error('Invalid submissionIds:', invalidSubmissionIds);
      return res.status(400).json({ message: 'One or more submission IDs are invalid.' });
    }

    // Get all evaluator assignments for this hackathon
    const allEvaluators = await JudgeAssignment.find({ 
      hackathon: hackathonId,
      status: { $in: ['active', 'pending'] }
    });

    // Get already assigned submissions for this round to prevent duplicates
    const alreadyAssignedSubmissions = new Set();
    allEvaluators.forEach(evaluator => {
      const roundAssignment = evaluator.assignedRounds?.find(r => r.roundIndex === roundIndex);
      if (roundAssignment?.assignedSubmissions) {
        roundAssignment.assignedSubmissions.forEach(subId => {
          alreadyAssignedSubmissions.add(subId.toString());
        });
      }
    });

    // Filter out already assigned submissions
    const availableSubmissionIds = submissionIds.filter(id => !alreadyAssignedSubmissions.has(id.toString()));
    const duplicateSubmissionIds = submissionIds.filter(id => alreadyAssignedSubmissions.has(id.toString()));

    if (availableSubmissionIds.length === 0) {
      return res.status(400).json({ 
        message: 'All selected submissions are already assigned to judges for this round.',
        duplicateSubmissions: duplicateSubmissionIds
      });
    }

    if (duplicateSubmissionIds.length > 0) {
      console.warn(`Filtering out ${duplicateSubmissionIds.length} already assigned submissions:`, duplicateSubmissionIds);
    }

    // Defensive check for evaluatorAssignments
    if (!Array.isArray(evaluatorAssignments) || evaluatorAssignments.length === 0) {
      return res.status(400).json({ message: 'At least one evaluator is required' });
    }

    // Validate that all evaluator assignments reference a valid, active judge
    const activeEvaluators = allEvaluators.filter(e => e.status === 'active');
    const invalidEvaluators = evaluatorAssignments.filter(assignment => {
      const found = allEvaluators.find(e => 
        e._id.toString() === assignment.evaluatorId || e.judge.email === assignment.evaluatorEmail
      );
      return !found || found.status !== 'active';
    });
    if (invalidEvaluators.length > 0) {
      console.error('Invalid or inactive evaluator assignments:', invalidEvaluators);
      return res.status(400).json({ message: 'One or more evaluator assignments are invalid or inactive.' });
    }

    if (activeEvaluators.length === 0) {
      return res.status(400).json({ 
        message: 'No active evaluators found. Please ensure evaluators have accepted their invitations.' 
      });
    }

    const results = [];
    const totalSubmissions = availableSubmissionIds.length;
    let remainingSubmissions = [...availableSubmissionIds];

    // Handle multiple judges per project logic
    if (multipleJudgesMode) {
      // Create a map to track which submissions are assigned to which judges
      const submissionJudgeMap = new Map();
      
      // Initialize the map for all submissions
      submissionIds.forEach(submissionId => {
        submissionJudgeMap.set(submissionId.toString(), []);
      });

      // Process each evaluator assignment for multiple judges mode
      for (const assignment of evaluatorAssignments) {
        const { evaluatorId, maxSubmissions, evaluatorEmail } = assignment;
        
        // Find the evaluator assignment
        const evaluatorAssignment = allEvaluators.find(e => 
          e._id.toString() === evaluatorId || e.judge.email === evaluatorEmail
        );
        
        if (!evaluatorAssignment) {
          results.push({
            evaluatorId,
            success: false,
            error: 'Evaluator not found'
          });
          continue;
        }

        // Check if evaluator is active
        if (evaluatorAssignment.status !== 'active') {
          results.push({
            evaluatorId,
            success: false,
            error: `Evaluator ${evaluatorAssignment.judge.email} has not accepted the invitation yet`
          });
          continue;
        }

        // Calculate submissions to assign based on multiple judges logic
        let submissionsToAssign = [];
        let actualMaxSubmissions = maxSubmissions || Math.ceil(totalSubmissions / evaluatorAssignments.length);
        
        // For multiple judges mode, we need to distribute submissions more carefully
        if (judgesPerProjectMode === 'equal') {
          // Equal distribution: each submission gets assigned to multiple judges equally
          const judgesPerSubmission = Math.ceil(evaluatorAssignments.length / totalSubmissions);
          submissionsToAssign = availableSubmissionIds.filter(submissionId => {
            const currentJudges = submissionJudgeMap.get(submissionId.toString()) || [];
            return currentJudges.length < judgesPerSubmission;
          }).slice(0, actualMaxSubmissions);
        } else {
          // Manual mode: assign based on judgesPerProject setting
          submissionsToAssign = availableSubmissionIds.filter(submissionId => {
            const currentJudges = submissionJudgeMap.get(submissionId.toString()) || [];
            return currentJudges.length < judgesPerProject;
          }).slice(0, actualMaxSubmissions);
        }

        // Update the submission-judge mapping
        submissionsToAssign.forEach(submissionId => {
          const currentJudges = submissionJudgeMap.get(submissionId.toString()) || [];
          currentJudges.push(evaluatorAssignment._id.toString());
          submissionJudgeMap.set(submissionId.toString(), currentJudges);
        });

        // Update the judge assignment with new submissions for this round
        const existingRoundIndex = evaluatorAssignment.assignedRounds.findIndex(r => r.roundIndex === roundIndex);
        
        // Get round details with fallbacks
        const roundDetails = hackathon.rounds[roundIndex] || {};
        const roundName = roundDetails.name || `Round ${roundIndex + 1}`;
        const roundType = roundDetails.type || 'project';
        const roundId = roundDetails._id?.toString() || `round_${roundIndex}`;
        
        if (existingRoundIndex >= 0) {
          // Update existing round assignment
          evaluatorAssignment.assignedRounds[existingRoundIndex] = {
            ...evaluatorAssignment.assignedRounds[existingRoundIndex],
            roundIndex,
            roundId,
            roundName,
            roundType,
            isAssigned: true,
            assignedSubmissions: submissionsToAssign,
            maxSubmissions: actualMaxSubmissions
          };
        } else {
          // Add new round assignment
          evaluatorAssignment.assignedRounds.push({
            roundIndex,
            roundId,
            roundName,
            roundType,
            isAssigned: true,
            assignedSubmissions: submissionsToAssign,
            maxSubmissions: actualMaxSubmissions
          });
        }

        try {
          await evaluatorAssignment.save();
        } catch (saveError) {
          console.error('Error saving evaluatorAssignment:', {
            evaluatorAssignmentId: evaluatorAssignment._id,
            assignedRounds: evaluatorAssignment.assignedRounds,
            error: saveError
          });
          throw saveError;
        }

        results.push({
          evaluatorId: evaluatorAssignment._id,
          evaluatorEmail: evaluatorAssignment.judge.email,
          evaluatorName: evaluatorAssignment.judge.name,
          success: true,
          assignedSubmissions: submissionsToAssign,
          maxSubmissions: actualMaxSubmissions,
          status: evaluatorAssignment.status
        });
      }
    } else {
      // Original single judge per project logic
      // Process each evaluator assignment
      for (const assignment of evaluatorAssignments) {
        const { evaluatorId, maxSubmissions, evaluatorEmail } = assignment;
        
        // Find the evaluator assignment
        const evaluatorAssignment = allEvaluators.find(e => 
          e._id.toString() === evaluatorId || e.judge.email === evaluatorEmail
        );
        
        if (!evaluatorAssignment) {
          results.push({
            evaluatorId,
            success: false,
            error: 'Evaluator not found'
          });
          continue;
        }

        // Check if evaluator is active
        if (evaluatorAssignment.status !== 'active') {
          results.push({
            evaluatorId,
            success: false,
            error: `Evaluator ${evaluatorAssignment.judge.email} has not accepted the invitation yet`
          });
          continue;
        }

        // Calculate submissions to assign based on mode
        let submissionsToAssign = [];
        let actualMaxSubmissions = maxSubmissions || Math.ceil(totalSubmissions / evaluatorAssignments.length);
        
        if (assignmentMode === 'equal') {
          const equalCount = Math.ceil(totalSubmissions / evaluatorAssignments.length);
          const startIndex = evaluatorAssignments.indexOf(assignment) * equalCount;
          submissionsToAssign = remainingSubmissions.slice(0, equalCount);
          actualMaxSubmissions = equalCount;
        } else {
          // Manual mode - assign based on maxSubmissions
          submissionsToAssign = remainingSubmissions.slice(0, actualMaxSubmissions);
        }

        // Remove assigned submissions from remaining pool
        remainingSubmissions = remainingSubmissions.filter(id => !submissionsToAssign.includes(id));

        // Update the judge assignment with new submissions for this round
        const existingRoundIndex = evaluatorAssignment.assignedRounds.findIndex(r => r.roundIndex === roundIndex);
        
        // Get round details with fallbacks
        const roundDetails = hackathon.rounds[roundIndex] || {};
        const roundName = roundDetails.name || `Round ${roundIndex + 1}`;
        const roundType = roundDetails.type || 'project';
        const roundId = roundDetails._id?.toString() || `round_${roundIndex}`;
        
        if (existingRoundIndex >= 0) {
          // Update existing round assignment
          evaluatorAssignment.assignedRounds[existingRoundIndex] = {
            ...evaluatorAssignment.assignedRounds[existingRoundIndex],
            roundIndex,
            roundId,
            roundName,
            roundType,
            isAssigned: true,
            assignedSubmissions: submissionsToAssign,
            maxSubmissions: actualMaxSubmissions
          };
        } else {
          // Add new round assignment
          evaluatorAssignment.assignedRounds.push({
            roundIndex,
            roundId,
            roundName,
            roundType,
            isAssigned: true,
            assignedSubmissions: submissionsToAssign,
            maxSubmissions: actualMaxSubmissions
          });
        }

        await evaluatorAssignment.save();

        results.push({
          evaluatorId: evaluatorAssignment._id,
          evaluatorEmail: evaluatorAssignment.judge.email,
          evaluatorName: evaluatorAssignment.judge.name,
          success: true,
          assignedSubmissions: submissionsToAssign,
          maxSubmissions: actualMaxSubmissions,
          status: evaluatorAssignment.status
        });
      }
    }

    // Check if all submissions were assigned
    const unassignedCount = remainingSubmissions.length;
    if (unassignedCount > 0) {
      console.warn(`${unassignedCount} submissions could not be assigned due to evaluator limits`);
    }

    res.status(200).json({
      message: 'Bulk assignment completed successfully',
      results,
      totalSubmissions,
      assignedSubmissions: totalSubmissions - unassignedCount,
      unassignedSubmissions: unassignedCount,
      filteredSubmissions: duplicateSubmissionIds.length > 0 ? {
        count: duplicateSubmissionIds.length,
        submissions: duplicateSubmissionIds,
        message: `${duplicateSubmissionIds.length} submissions were already assigned and were filtered out`
      } : null,
      totalEvaluators: evaluatorAssignments.length,
      activeEvaluators: activeEvaluators.length,
      multipleJudgesMode,
      judgesPerProject: multipleJudgesMode ? judgesPerProject : 1,
      judgesPerProjectMode: multipleJudgesMode ? judgesPerProjectMode : 'manual'
    });

  } catch (error) {
    console.error('Error bulk assigning submissions:', error);
    if (error && error.stack) {
      console.error(error.stack);
    }
    res.status(500).json({ message: 'Failed to bulk assign submissions' });
  }
};

// 🎯 Get All Evaluators with Status
exports.getAllEvaluators = async (req, res) => {
  try {
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Verify organizer permissions
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can view evaluators' });
    }

    const assignments = await JudgeAssignment.find({ hackathon: hackathonId })
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    const evaluators = assignments.map(assignment => ({
      id: assignment._id,
      name: assignment.judge.name || assignment.judge.email.split('@')[0],
      email: assignment.judge.email,
      type: assignment.judge.type,
      status: assignment.status,
      sponsorCompany: assignment.judge.sponsorCompany,
      assignedSubmissions: assignment.assignedRounds.reduce((total, round) => 
        total + (round.assignedSubmissions?.length || 0), 0),
      maxSubmissions: assignment.permissions.maxSubmissionsPerJudge,
      invitationSent: !!assignment.invitation.sentAt,
      acceptedAt: assignment.invitation.acceptedAt,
      declinedAt: assignment.invitation.declinedAt
    }));

    res.status(200).json({
      evaluators,
      total: evaluators.length,
      pending: evaluators.filter(e => e.status === 'pending').length,
      active: evaluators.filter(e => e.status === 'active').length,
      declined: evaluators.filter(e => e.status === 'declined').length
    });

  } catch (error) {
    console.error('Error fetching evaluators:', error);
    res.status(500).json({ message: 'Failed to fetch evaluators' });
  }
};

// 🎯 Update Judge Status (Accept/Decline)
exports.updateJudgeStatus = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { status } = req.body; // 'accept' or 'decline'

    const assignment = await JudgeAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Judge assignment not found' });
    }

    if (status === 'accept') {
      assignment.status = 'active';
      assignment.invitation.acceptedAt = new Date();
      assignment.lastActive = new Date();
    } else if (status === 'decline') {
      assignment.status = 'declined';
      assignment.invitation.declinedAt = new Date();
    }

    await assignment.save();

    res.status(200).json({
      message: `Judge ${status === 'accept' ? 'accepted' : 'declined'} the invitation`,
      assignment
    });

  } catch (error) {
    console.error('Error updating judge status:', error);
    res.status(500).json({ message: 'Failed to update judge status' });
  }
};

// 🎯 Get My Assigned Submissions (for judges)
exports.getMyAssignedSubmissions = async (req, res) => {
  try {
    const judgeEmail = req.user.email;
    console.log('🔍 Backend - getMyAssignedSubmissions called for judge:', judgeEmail);
    
    // Find all judge assignments for this user
    const assignments = await JudgeAssignment.find({ 
      'judge.email': judgeEmail,
      status: 'active'
    }).populate('hackathon', 'name rounds');
    
    console.log('🔍 Backend - Found assignments:', assignments.length);
    console.log('🔍 Backend - Assignments:', assignments);
    
    // If no assignments found, return empty response
    if (assignments.length === 0) {
      console.log('🔍 Backend - No assignments found for judge');
      const response = {
        submissions: [],
        rounds: [],
        hackathons: [],
        totalSubmissions: 0,
        totalRounds: 0,
        totalHackathons: 0,
        hasSpecificAssignments: false
      };
      res.status(200).json(response);
      return;
    }

    const submissions = [];
    const rounds = [];
    const hackathons = [];
    const allSubmissions = [];

    for (const assignment of assignments) {
      const hackathon = assignment.hackathon;
      console.log('🔍 Backend - Processing assignment:', assignment._id);
      console.log('🔍 Backend - Assignment data:', {
        judgeEmail: assignment.judge?.email,
        hackathonId: hackathon?._id,
        assignedRounds: assignment.assignedRounds,
        status: assignment.status
      });
      
      // Check if judge has any specific assignments
      let hasSpecificAssignments = false;
      let assignedSubmissionIds = new Set();
      
      if (assignment.assignedRounds && Array.isArray(assignment.assignedRounds)) {
        for (const round of assignment.assignedRounds) {
          console.log('🔍 Backend - Processing round:', round);
          if (round.isAssigned && round.assignedSubmissions && Array.isArray(round.assignedSubmissions) && round.assignedSubmissions.length > 0) {
            hasSpecificAssignments = true;
            round.assignedSubmissions.forEach(id => assignedSubmissionIds.add(id.toString()));
          }
        }
      } else {
        console.log('🔍 Backend - No assignedRounds found in assignment or not an array');
      }

      // If judge has specific assignments, show only those
      // If no specific assignments, show NO submissions (empty dashboard)
      let submissionsToFetch = [];
      
      if (hasSpecificAssignments && assignedSubmissionIds.size > 0) {
        try {
          // Get only assigned submissions
          const Submission = require('../model/SubmissionModel');
          submissionsToFetch = await Submission.find({
            _id: { $in: Array.from(assignedSubmissionIds) }
          }).populate('teamId', 'name members')
            .populate('hackathonId', 'name');
          console.log('🔍 Backend - Found submissions:', submissionsToFetch.length);
        } catch (submissionError) {
          console.error('🔍 Backend - Error fetching submissions:', submissionError);
          submissionsToFetch = [];
        }
      } else {
        console.log('🔍 Backend - No specific assignments found, showing empty list');
        submissionsToFetch = [];
      }

      // Process rounds
      if (assignment.assignedRounds && Array.isArray(assignment.assignedRounds)) {
        for (const round of assignment.assignedRounds) {
          if (round && round.isAssigned) {
            const roundInfo = {
              index: round.roundIndex || 0,
              name: round.roundName || 'Round',
              type: round.roundType || 'project',
              submissionCount: hasSpecificAssignments ? (round.assignedSubmissions?.length || 0) : submissionsToFetch.length,
              hackathonId: hackathon._id,
              hackathonName: hackathon.name,
              hasSpecificAssignments: hasSpecificAssignments
            };

            if (!rounds.find(r => r.index === roundInfo.index && r.hackathonId.toString() === hackathon._id.toString())) {
              rounds.push(roundInfo);
            }
          }
        }
      }

      // Add submissions with evaluation status
      for (const submission of submissionsToFetch) {
        try {
          // Check if this submission has been scored by this judge
          const Score = require('../model/ScoreModel');
          const existingScore = await Score.findOne({
            submission: submission._id,
            judge: assignment._id
          });

          const submissionData = {
            ...submission.toObject(),
            evaluationStatus: existingScore ? 'evaluated' : 'pending',
            score: existingScore?.score || null,
            feedback: existingScore?.feedback || null,
            roundIndex: assignment.assignedRounds?.[0]?.roundIndex || 0,
            roundName: assignment.assignedRounds?.[0]?.roundName || 'Round 1',
            hackathonId: hackathon._id,
            hackathonName: hackathon.name,
            isAssigned: hasSpecificAssignments ? assignedSubmissionIds.has(submission._id.toString()) : false
          };

          submissions.push(submissionData);
          allSubmissions.push(submissionData);
        } catch (submissionError) {
          console.error('🔍 Backend - Error processing submission:', submissionError);
        }
      }
      
      // Add hackathon to list
      if (hackathon && hackathon._id) {
        hackathons.push({
          _id: hackathon._id,
          name: hackathon.name || 'Unknown Hackathon',
          hasSpecificAssignments: hasSpecificAssignments
        });
      }
    }

    // Remove duplicate hackathons
    const uniqueHackathons = hackathons.filter((hackathon, index, self) => 
      index === self.findIndex(h => h._id.toString() === hackathon._id.toString())
    );

    res.status(200).json({
      submissions: allSubmissions,
      rounds,
      hackathons: uniqueHackathons,
      totalSubmissions: allSubmissions.length,
      totalRounds: rounds.length,
      totalHackathons: uniqueHackathons.length,
      hasSpecificAssignments: uniqueHackathons.some(h => h.hasSpecificAssignments)
    });

  } catch (error) {
    console.error('🔍 Backend - Error in getMyAssignedSubmissions:', error);
    console.error('🔍 Backend - Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to fetch assigned submissions',
      error: error.message,
      stack: error.stack
    });
  }
};

// 🎯 Update Submission Status (Shortlist/Reject)
exports.updateSubmissionStatus = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status } = req.body; // 'shortlisted' or 'rejected'
    const judgeEmail = req.user.email;

    // Validate status
    if (!['shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either "shortlisted" or "rejected"' });
    }

    // Find the submission
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Verify organizer permissions (only organizers can shortlist/reject)
    const hackathon = await Hackathon.findById(submission.hackathonId);
    if (!hackathon || hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can update submission status' });
    }

    // Update the submission status
    submission.status = status;
    await submission.save();

    res.status(200).json({
      message: `Submission ${status} successfully`,
      submission: {
        _id: submission._id,
        status: submission.status,
        teamName: submission.teamName
      }
    });

  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({ message: 'Failed to update submission status' });
  }
};

// 🎯 Score a Submission (for judges)
exports.scoreSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { scores, feedback, roundIndex, submissionType } = req.body;
    const judgeEmail = req.user.email;

    // Validate inputs
    if (!scores || typeof scores !== 'object') {
      return res.status(400).json({ message: 'Scores object is required' });
    }

    if (!submissionType || !['project', 'presentation'].includes(submissionType)) {
      return res.status(400).json({ message: 'Submission type must be either "project" or "presentation"' });
    }

    // Find judge assignment
    const assignment = await JudgeAssignment.findOne({
      'judge.email': judgeEmail,
      status: 'active'
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Judge assignment not found' });
    }

    // Verify the submission is assigned to this judge
    const isAssigned = assignment.assignedRounds.some(round => 
      round.roundIndex === roundIndex && 
      round.assignedSubmissions.includes(submissionId)
    );

    if (!isAssigned) {
      return res.status(403).json({ message: 'This submission is not assigned to you' });
    }

    // Get judging criteria for validation
    const hackathon = await Hackathon.findById(assignment.hackathon);
    const round = hackathon.rounds[roundIndex];
    const criteria = round.judgingCriteria?.[submissionType] || [];

    // Validate scores against criteria
    const validatedScores = new Map();
    let totalScore = 0;
    let totalWeight = 0;

    for (const criterion of criteria) {
      const score = scores[criterion.name];
      if (score === undefined || score === null) {
        return res.status(400).json({ message: `Score for ${criterion.name} is required` });
      }
      
      if (typeof score !== 'number' || score < 0 || score > criterion.maxScore) {
        return res.status(400).json({ 
          message: `Score for ${criterion.name} must be between 0 and ${criterion.maxScore}` 
        });
      }

      validatedScores.set(criterion.name, {
        score: score,
        maxScore: criterion.maxScore,
        weight: criterion.weight || 1
      });

      totalScore += score * (criterion.weight || 1);
      totalWeight += criterion.weight || 1;
    }

    // Calculate weighted average
    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    // Check if already scored
    const existingScore = await Score.findOne({
      submission: submissionId,
      judge: assignment._id,
      roundIndex: roundIndex,
      submissionType: submissionType
    });

    if (existingScore) {
      // Update existing score
      existingScore.scores = validatedScores;
      existingScore.totalScore = finalScore;
      existingScore.feedback = feedback;
      existingScore.updatedAt = new Date();
      await existingScore.save();
    } else {
      // Create new score
      await Score.create({
        submission: submissionId,
        judge: assignment._id,
        roundIndex: roundIndex,
        submissionType: submissionType,
        scores: validatedScores,
        totalScore: finalScore,
        feedback: feedback
      });
    }

    res.status(200).json({
      message: 'Score submitted successfully',
      totalScore: finalScore,
      scores: Object.fromEntries(validatedScores),
      feedback: feedback
    });

  } catch (error) {
    console.error('Error scoring submission:', error);
    res.status(500).json({ message: 'Failed to score submission' });
  }
};

// 🎯 Get Judging Criteria for Hackathon Round
exports.getJudgingCriteria = async (req, res) => {
  try {
    const { hackathonId, roundIndex } = req.params;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    if (!hackathon.rounds || !hackathon.rounds[roundIndex]) {
      return res.status(404).json({ message: 'Round not found' });
    }

    const round = hackathon.rounds[roundIndex];
    const criteria = round.judgingCriteria || {
      project: [
        { name: 'Innovation', description: 'Originality and creativity of the solution', maxScore: 10, weight: 1 },
        { name: 'Impact', description: 'Potential impact and value of the solution', maxScore: 10, weight: 1 },
        { name: 'Technicality', description: 'Technical complexity and implementation', maxScore: 10, weight: 1 },
        { name: 'Presentation', description: 'Quality of presentation and communication', maxScore: 10, weight: 1 }
      ],
      presentation: [
        { name: 'Clarity', description: 'Clear and understandable presentation', maxScore: 10, weight: 1 },
        { name: 'Engagement', description: 'How engaging and compelling the presentation is', maxScore: 10, weight: 1 },
        { name: 'Content', description: 'Quality and relevance of content', maxScore: 10, weight: 1 },
        { name: 'Delivery', description: 'Quality of delivery and communication skills', maxScore: 10, weight: 1 }
      ]
    };

    res.status(200).json({
      message: 'Judging criteria retrieved successfully',
      criteria,
      roundName: round.name,
      roundType: round.type
    });

  } catch (error) {
    console.error('Error getting judging criteria:', error);
    res.status(500).json({ message: 'Failed to get judging criteria' });
  }
};

// 🎯 Update Judging Criteria for Hackathon Round
exports.updateJudgingCriteria = async (req, res) => {
  try {
    const { hackathonId, roundIndex } = req.params;
    const { criteria } = req.body;

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Verify organizer permissions
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can update judging criteria' });
    }

    if (!hackathon.rounds || !hackathon.rounds[roundIndex]) {
      return res.status(404).json({ message: 'Round not found' });
    }

    // Validate criteria structure
    if (!criteria || (!criteria.project && !criteria.presentation)) {
      return res.status(400).json({ message: 'At least one criteria type (project or presentation) is required' });
    }

    // Validate individual criteria
    const validateCriteria = (criteriaList, type) => {
      if (!Array.isArray(criteriaList)) {
        throw new Error(`${type} criteria must be an array`);
      }
      
      for (const criterion of criteriaList) {
        if (!criterion.name || typeof criterion.name !== 'string') {
          throw new Error(`${type} criteria must have valid names`);
        }
        if (criterion.maxScore && (typeof criterion.maxScore !== 'number' || criterion.maxScore <= 0)) {
          throw new Error(`${type} criteria must have valid max scores`);
        }
        if (criterion.weight && (typeof criterion.weight !== 'number' || criterion.weight <= 0)) {
          throw new Error(`${type} criteria must have valid weights`);
        }
      }
    };

    if (criteria.project) {
      validateCriteria(criteria.project, 'Project');
    }
    if (criteria.presentation) {
      validateCriteria(criteria.presentation, 'Presentation');
    }

    // Update the round with new criteria
    const updateQuery = {};
    if (criteria.project) {
      updateQuery[`rounds.${roundIndex}.judgingCriteria.project`] = criteria.project;
    }
    if (criteria.presentation) {
      updateQuery[`rounds.${roundIndex}.judgingCriteria.presentation`] = criteria.presentation;
    }

    const updatedHackathon = await Hackathon.findByIdAndUpdate(
      hackathonId,
      { $set: updateQuery },
      { new: true }
    );

    res.status(200).json({
      message: 'Judging criteria updated successfully',
      criteria: updatedHackathon.rounds[roundIndex].judgingCriteria
    });

  } catch (error) {
    console.error('Error updating judging criteria:', error);
    res.status(500).json({ message: error.message || 'Failed to update judging criteria' });
  }
};

// 🗑️ Delete Judge and All Their Assignments
exports.deleteJudge = async (req, res) => {
  try {
    const { hackathonId, judgeId } = req.params;

    // Find the hackathon
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Verify organizer permissions
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can delete judges' });
    }

    // Find the judge assignment
    const judgeAssignment = await JudgeAssignment.findById(judgeId);
    if (!judgeAssignment) {
      return res.status(404).json({ message: 'Judge assignment not found' });
    }

    // Verify this assignment belongs to the specified hackathon
    if (judgeAssignment.hackathon.toString() !== hackathonId) {
      return res.status(400).json({ message: 'Judge assignment does not belong to this hackathon' });
    }

    const judgeEmail = judgeAssignment.judge.email;
    const judgeIdFromAssignment = judgeAssignment.judge._id;

    // Start a transaction to ensure data consistency
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Remove all scores given by this judge
      const scoresToDelete = await Score.find({
        judge: judgeIdFromAssignment,
        hackathon: hackathonId
      });
      
      if (scoresToDelete.length > 0) {
        await Score.deleteMany({
          judge: judgeIdFromAssignment,
          hackathon: hackathonId
        });
        console.log(`Deleted ${scoresToDelete.length} scores from judge ${judgeEmail}`);
      }

      // 2. Remove judge from all submissions they were assigned to
      const assignedSubmissionIds = [];
      judgeAssignment.assignedRounds?.forEach(round => {
        if (round.assignedSubmissions) {
          assignedSubmissionIds.push(...round.assignedSubmissions);
        }
      });

      if (assignedSubmissionIds.length > 0) {
        // Update submissions to remove this judge from assignedJudges
        await Submission.updateMany(
          { _id: { $in: assignedSubmissionIds } },
          { $pull: { assignedJudges: judgeIdFromAssignment } }
        );
        console.log(`Removed judge ${judgeEmail} from ${assignedSubmissionIds.length} submissions`);
      }

      // 3. Delete the judge assignment
      await JudgeAssignment.findByIdAndDelete(judgeId);

      // 4. Remove judge from hackathon's judgeAssignments if it exists
      if (hackathon.judgeAssignments) {
        const updatedJudgeAssignments = {};
        Object.keys(hackathon.judgeAssignments).forEach(type => {
          if (Array.isArray(hackathon.judgeAssignments[type])) {
            updatedJudgeAssignments[type] = hackathon.judgeAssignments[type].filter(
              assignment => assignment.judge.toString() !== judgeIdFromAssignment.toString()
            );
          }
        });
        
        await Hackathon.findByIdAndUpdate(hackathonId, {
          judgeAssignments: updatedJudgeAssignments
        });
      }

      // 5. Optionally remove judge role from user (if they should lose judge access)
      const user = await User.findById(judgeIdFromAssignment);
      if (user) {
        // Remove judge role for this specific hackathon
        const updatedRoles = user.roles.filter(role => 
          !(role.role === 'judge' && role.hackathon?.toString() === hackathonId)
        );
        
        await User.findByIdAndUpdate(judgeIdFromAssignment, {
          roles: updatedRoles
        });
        console.log(`Removed judge role from user ${judgeEmail} for hackathon ${hackathonId}`);
      }

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        message: 'Judge deleted successfully',
        deletedJudge: {
          email: judgeEmail,
          assignmentsRemoved: assignedSubmissionIds.length,
          scoresRemoved: scoresToDelete.length
        }
      });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

  } catch (error) {
    console.error('Error deleting judge:', error);
    res.status(500).json({ 
      message: 'Failed to delete judge',
      error: error.message 
    });
  }
};

// 🎯 Assignment Overview for Organizer
exports.getAssignmentOverview = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Get all judge assignments for this hackathon
    const judgeAssignments = await JudgeAssignment.find({ hackathon: hackathonId })
      .populate('judge')
      .lean();

    // Get all submissions for this hackathon
    const submissions = await Submission.find({ hackathonId: hackathonId, status: 'submitted' })
      .select('_id projectTitle title teamId teamName pptFile submittedAt')
      .lean();

    // Get all scores for these submissions
    const scores = await Score.find({ 
      submissionId: { $in: submissions.map(s => s._id) } 
    }).lean();

    // Create a map of submission scores
    const submissionScores = {};
    scores.forEach(score => {
      if (!submissionScores[score.submissionId.toString()]) {
        submissionScores[score.submissionId.toString()] = [];
      }
      submissionScores[score.submissionId.toString()].push(score);
    });

    // Map: submissionId -> assigned judge emails with round info
    const submissionAssignments = {};
    submissions.forEach(sub => {
      submissionAssignments[sub._id.toString()] = [];
    });

    // Map: judge email -> assigned submission IDs with round info
    const judgeToSubmissions = {};
    judgeAssignments.forEach(judgeAssignment => {
      const judgeEmail = judgeAssignment.judge?.email || judgeAssignment.judge.email;
      judgeToSubmissions[judgeEmail] = [];
      (judgeAssignment.assignedRounds || []).forEach(round => {
        (round.assignedSubmissions || []).forEach(subId => {
          judgeToSubmissions[judgeEmail].push({
            submissionId: subId.toString(),
            roundIndex: round.roundIndex,
            roundName: round.roundName,
            roundType: round.roundType
          });
          if (submissionAssignments[subId.toString()]) {
            submissionAssignments[subId.toString()].push({
              judgeEmail,
              judgeName: judgeAssignment.judge?.name || judgeEmail,
              roundIndex: round.roundIndex,
              roundName: round.roundName,
              roundType: round.roundType
            });
          }
        });
      });
    });

    // Build judge assignment summary with evaluation status
    const judges = judgeAssignments.map(judgeAssignment => {
      const judgeEmail = judgeAssignment.judge?.email || judgeAssignment.judge.email;
      return {
        judgeEmail,
        judgeName: judgeAssignment.judge?.name || judgeEmail,
        judgeType: judgeAssignment.judge?.type || 'platform',
        assignedSubmissions: (judgeToSubmissions[judgeEmail] || []).map(assignment => {
          const sub = submissions.find(s => s._id.toString() === assignment.submissionId);
          if (!sub) return null;
          
          const submissionScoresList = submissionScores[assignment.submissionId] || [];
          const averageScore = submissionScoresList.length > 0 
            ? submissionScoresList.reduce((sum, score) => sum + (score.totalScore || 0), 0) / submissionScoresList.length
            : null;
          
          return {
            _id: sub._id,
            projectTitle: sub.projectTitle || sub.title,
            teamId: sub.teamId,
            teamName: sub.teamName,
            pptFile: sub.pptFile,
            submittedAt: sub.submittedAt,
            roundIndex: assignment.roundIndex,
            roundName: assignment.roundName,
            roundType: assignment.roundType,
            evaluationStatus: submissionScoresList.length > 0 ? 'evaluated' : 'pending',
            scoreCount: submissionScoresList.length,
            averageScore: averageScore ? Math.round(averageScore * 10) / 10 : null,
            scores: submissionScoresList.map(score => ({
              judgeEmail: score.judgeEmail,
              totalScore: score.totalScore,
              criteria: score.criteria || []
            }))
          };
        }).filter(Boolean)
      };
    });

    // Find unassigned submissions
    const unassignedSubmissions = submissions.filter(sub =>
      (submissionAssignments[sub._id.toString()] || []).length === 0
    ).map(sub => ({
      _id: sub._id,
      projectTitle: sub.projectTitle || sub.title,
      teamId: sub.teamId,
      teamName: sub.teamName,
      pptFile: sub.pptFile,
      submittedAt: sub.submittedAt
    }));

    // Build assigned submissions with judge information
    const assignedSubmissions = submissions.filter(sub =>
      (submissionAssignments[sub._id.toString()] || []).length > 0
    ).map(sub => {
      const submissionScoresList = submissionScores[sub._id.toString()] || [];
      const averageScore = submissionScoresList.length > 0 
        ? submissionScoresList.reduce((sum, score) => sum + (score.totalScore || 0), 0) / submissionScoresList.length
        : null;
      
      return {
        _id: sub._id,
        projectTitle: sub.projectTitle || sub.title,
        teamId: sub.teamId,
        teamName: sub.teamName,
        pptFile: sub.pptFile,
        submittedAt: sub.submittedAt,
        assignedJudges: submissionAssignments[sub._id.toString()] || [],
        evaluationStatus: submissionScoresList.length > 0 ? 'evaluated' : 'pending',
        scoreCount: submissionScoresList.length,
        averageScore: averageScore ? Math.round(averageScore * 10) / 10 : null,
        scores: submissionScoresList.map(score => ({
          judgeEmail: score.judgeEmail,
          totalScore: score.totalScore,
          criteria: score.criteria || []
        }))
      };
    });

    res.status(200).json({
      judges,
      unassignedSubmissions,
      assignedSubmissions,
      summary: {
        totalSubmissions: submissions.length,
        assignedSubmissions: assignedSubmissions.length,
        unassignedSubmissions: unassignedSubmissions.length,
        evaluatedSubmissions: assignedSubmissions.filter(s => s.evaluationStatus === 'evaluated').length,
        pendingEvaluations: assignedSubmissions.filter(s => s.evaluationStatus === 'pending').length
      }
    });
  } catch (error) {
    console.error('Error in getAssignmentOverview:', error);
    res.status(500).json({ message: 'Failed to get assignment overview' });
  }
};

// 🎯 Get Submissions with Assignment Status for Round
exports.getSubmissionsWithAssignmentStatus = async (req, res) => {
  try {
    const { hackathonId, roundIndex } = req.params;
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Get all submissions for this hackathon
    const submissions = await Submission.find({ hackathonId: hackathonId, status: 'submitted' })
      .select('_id projectTitle title teamId teamName pptFile submittedAt')
      .lean();

    // Get all judge assignments for this hackathon
    const judgeAssignments = await JudgeAssignment.find({ hackathon: hackathonId })
      .populate('judge')
      .lean();

    // Get all scores for these submissions
    const scores = await Score.find({ 
      submissionId: { $in: submissions.map(s => s._id) } 
    }).lean();

    // Create a map of submission scores
    const submissionScores = {};
    scores.forEach(score => {
      if (!submissionScores[score.submissionId.toString()]) {
        submissionScores[score.submissionId.toString()] = [];
      }
      submissionScores[score.submissionId.toString()].push(score);
    });

    // Map: submissionId -> assigned judge emails for this round
    const submissionAssignments = {};
    submissions.forEach(sub => {
      submissionAssignments[sub._id.toString()] = [];
    });

    // Build assignment map for this round
    judgeAssignments.forEach(judgeAssignment => {
      const judgeEmail = judgeAssignment.judge?.email || judgeAssignment.judge.email;
      const roundAssignment = judgeAssignment.assignedRounds?.find(r => r.roundIndex === parseInt(roundIndex));
      
      if (roundAssignment?.assignedSubmissions) {
        roundAssignment.assignedSubmissions.forEach(subId => {
          if (submissionAssignments[subId.toString()]) {
            submissionAssignments[subId.toString()].push({
              judgeEmail,
              judgeName: judgeAssignment.judge?.name || judgeEmail,
              judgeType: judgeAssignment.judge?.type || 'platform',
              roundIndex: roundAssignment.roundIndex,
              roundName: roundAssignment.roundName,
              roundType: roundAssignment.roundType
            });
          }
        });
      }
    });

    // Build submissions with assignment status
    const submissionsWithStatus = submissions.map(sub => {
      const submissionScoresList = submissionScores[sub._id.toString()] || [];
      const averageScore = submissionScoresList.length > 0 
        ? submissionScoresList.reduce((sum, score) => sum + (score.totalScore || 0), 0) / submissionScoresList.length
        : null;
      
      return {
        _id: sub._id,
        projectTitle: sub.projectTitle || sub.title,
        teamId: sub.teamId,
        teamName: sub.teamName,
        pptFile: sub.pptFile,
        submittedAt: sub.submittedAt,
        isAssigned: (submissionAssignments[sub._id.toString()] || []).length > 0,
        assignedJudges: submissionAssignments[sub._id.toString()] || [],
        evaluationStatus: submissionScoresList.length > 0 ? 'evaluated' : 'pending',
        scoreCount: submissionScoresList.length,
        averageScore: averageScore ? Math.round(averageScore * 10) / 10 : null
      };
    });

    // Separate assigned and unassigned submissions
    const assignedSubmissions = submissionsWithStatus.filter(sub => sub.isAssigned);
    const unassignedSubmissions = submissionsWithStatus.filter(sub => !sub.isAssigned);

    res.status(200).json({
      assignedSubmissions,
      unassignedSubmissions,
      summary: {
        totalSubmissions: submissionsWithStatus.length,
        assignedSubmissions: assignedSubmissions.length,
        unassignedSubmissions: unassignedSubmissions.length,
        evaluatedSubmissions: submissionsWithStatus.filter(s => s.evaluationStatus === 'evaluated').length,
        pendingEvaluations: submissionsWithStatus.filter(s => s.evaluationStatus === 'pending').length
      }
    });
  } catch (error) {
    console.error('Error in getSubmissionsWithAssignmentStatus:', error);
    res.status(500).json({ message: 'Failed to get submissions with assignment status' });
  }
};

// 🎯 Get Leaderboard for Round 2 Shortlisting
exports.getLeaderboard = async (req, res) => {
  try {
    const { hackathonId, roundIndex = 1 } = req.params; // Default to Round 2 (index 1)
    
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Verify organizer permissions
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can view leaderboard' });
    }

    // Get all submissions for this hackathon and round
    const submissions = await Submission.find({ 
      hackathonId: hackathonId, 
      roundIndex: parseInt(roundIndex)
    }).populate('teamId', 'name leader')
      .populate('submittedBy', 'name email')
      .lean();

    console.log('🔍 Backend - Found submissions:', submissions.length);
    console.log('🔍 Backend - Submissions:', submissions.map(s => ({ id: s._id, title: s.projectTitle, status: s.status, roundIndex: s.roundIndex })));

    // Get all scores for these submissions
    const Score = require('../model/ScoreModel');
    const scores = await Score.find({ 
      submission: { $in: submissions.map(s => s._id) } 
    }).populate('judge', 'name email').lean();

    console.log('🔍 Backend - Found scores:', scores.length);
    console.log('🔍 Backend - Scores data:', scores);

    // Create a map of submission scores
    const submissionScores = {};
    scores.forEach(score => {
      if (!submissionScores[score.submission.toString()]) {
        submissionScores[score.submission.toString()] = [];
      }
      submissionScores[score.submission.toString()].push(score);
    });

    console.log('🔍 Backend - Submission scores map:', submissionScores);

    // Calculate leaderboard entries
    const leaderboard = submissions.map(submission => {
      const submissionScoresList = submissionScores[submission._id.toString()] || [];
      console.log('🔍 Backend - Processing submission:', submission._id, 'with scores:', submissionScoresList.length);
      
      // Calculate average score
      let averageScore = 0;
      let totalScore = 0;
      let scoreCount = 0;
      
      submissionScoresList.forEach(score => {
        console.log('🔍 Backend - Processing score:', score);
        // Convert Map to object if needed
        let scoresObject = {};
        if (score.scores && score.scores instanceof Map) {
          score.scores.forEach((value, key) => {
            scoresObject[key] = value.score;
          });
        } else if (score.scores && typeof score.scores === 'object') {
          scoresObject = score.scores;
        }
        
        console.log('🔍 Backend - Scores object:', scoresObject);
        const criteriaScores = Object.values(scoresObject).filter(s => typeof s === 'number');
        console.log('🔍 Backend - Criteria scores:', criteriaScores);
        if (criteriaScores.length > 0) {
          const submissionScore = criteriaScores.reduce((sum, s) => sum + s, 0) / criteriaScores.length;
          totalScore += submissionScore;
          scoreCount++;
          console.log('🔍 Backend - Submission score calculated:', submissionScore);
        }
      });
      
      averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;

      return {
        _id: submission._id,
        projectTitle: submission.projectTitle || submission.title || 'Untitled Project',
        teamName: submission.teamName || submission.teamId?.name || 'No Team',
        leaderName: submission.submittedBy?.name || submission.submittedBy?.email || 'Unknown',
        pptFile: submission.pptFile,
        submittedAt: submission.submittedAt,
        averageScore: Math.round(averageScore * 10) / 10,
        scoreCount,
        totalScore: Math.round(totalScore * 10) / 10,
        status: submission.status,
        roundIndex: submission.roundIndex
      };
    });

    console.log('🔍 Backend - Final leaderboard:', leaderboard);

    // Sort by average score (descending) and then by submission date (ascending for ties)
    leaderboard.sort((a, b) => {
      if (b.averageScore !== a.averageScore) {
        return b.averageScore - a.averageScore;
      }
      return new Date(a.submittedAt) - new Date(b.submittedAt);
    });

    // Add rank to each entry
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    res.status(200).json({
      hackathon: {
        id: hackathon._id,
        title: hackathon.title,
        roundIndex: parseInt(roundIndex)
      },
      leaderboard,
      summary: {
        totalSubmissions: leaderboard.length,
        evaluatedSubmissions: leaderboard.filter(s => s.scoreCount > 0).length,
        pendingEvaluations: leaderboard.filter(s => s.scoreCount === 0).length,
        shortlistedCount: leaderboard.filter(s => s.status === 'shortlisted').length,
        averageScore: leaderboard.length > 0 
          ? Math.round(leaderboard.reduce((sum, s) => sum + s.averageScore, 0) / leaderboard.length * 10) / 10
          : 0
      }
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};

// 🎯 Perform Shortlisting for Round 2
exports.performShortlisting = async (req, res) => {
  try {
    const { hackathonId, roundIndex = 1 } = req.params;
    const { shortlistCount, shortlistThreshold, mode, submissionIds } = req.body;
    
    console.log('🔍 Backend - performShortlisting called with:', { 
      hackathonId, roundIndex, shortlistCount, shortlistThreshold, mode, submissionIds 
    });
    
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Verify organizer permissions
    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the organizer can perform shortlisting' });
    }

    let submissionsToShortlist = [];

    if (submissionIds && Array.isArray(submissionIds)) {
      // Use provided submission IDs
      submissionsToShortlist = submissionIds;
    } else {
      // Get leaderboard data
      const submissions = await Submission.find({ 
        hackathonId: hackathonId, 
        status: 'submitted',
        roundIndex: parseInt(roundIndex)
      }).populate('teamId', 'name leader')
        .populate('submittedBy', 'name email')
        .lean();

      // Get all scores for these submissions
      const Score = require('../model/ScoreModel');
      const scores = await Score.find({ 
        submission: { $in: submissions.map(s => s._id) } 
      }).populate('judge', 'name email').lean();

      // Create a map of submission scores
      const submissionScores = {};
      scores.forEach(score => {
        if (!submissionScores[score.submission.toString()]) {
          submissionScores[score.submission.toString()] = [];
        }
        submissionScores[score.submission.toString()].push(score);
      });

      // Calculate leaderboard entries
      const leaderboard = submissions.map(submission => {
        const submissionScoresList = submissionScores[submission._id.toString()] || [];
        
        // Calculate average score
        let averageScore = 0;
        let totalScore = 0;
        let scoreCount = 0;
        
        submissionScoresList.forEach(score => {
          // Convert Map to object if needed
          let scoresObject = {};
          if (score.scores && score.scores instanceof Map) {
            score.scores.forEach((value, key) => {
              scoresObject[key] = value.score;
            });
          } else if (score.scores && typeof score.scores === 'object') {
            scoresObject = score.scores;
          }
          
          const criteriaScores = Object.values(scoresObject).filter(s => typeof s === 'number');
          if (criteriaScores.length > 0) {
            const submissionScore = criteriaScores.reduce((sum, s) => sum + s, 0) / criteriaScores.length;
            totalScore += submissionScore;
            scoreCount++;
          }
        });
        
        averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;

        return {
          _id: submission._id,
          projectTitle: submission.projectTitle || submission.title || 'Untitled Project',
          teamName: submission.teamName || submission.teamId?.name || 'No Team',
          leaderName: submission.submittedBy?.name || submission.submittedBy?.email || 'Unknown',
          pptFile: submission.pptFile,
          submittedAt: submission.submittedAt,
          averageScore: Math.round(averageScore * 10) / 10,
          scoreCount,
          totalScore: Math.round(totalScore * 10) / 10,
          status: submission.status,
          roundIndex: submission.roundIndex
        };
      });

      // Sort by average score (descending)
      leaderboard.sort((a, b) => b.averageScore - a.averageScore);

      // Apply shortlisting based on mode
      if (mode === 'topN') {
        // Validate input for topN mode
        if (!shortlistCount || shortlistCount < 1) {
          return res.status(400).json({ message: 'Valid shortlist count is required for topN mode' });
        }
        
        submissionsToShortlist = leaderboard
          .slice(0, shortlistCount)
          .map(entry => entry._id);
      } else if (mode === 'threshold') {
        // Validate input for threshold mode
        if (shortlistThreshold === undefined || shortlistThreshold < 0 || shortlistThreshold > 10) {
          return res.status(400).json({ message: 'Valid score threshold (0-10) is required for threshold mode' });
        }
        
        submissionsToShortlist = leaderboard
          .filter(entry => entry.averageScore >= shortlistThreshold)
          .map(entry => entry._id);
      } else if (mode === 'date') {
        // Shortlist all submissions (date-based)
        submissionsToShortlist = leaderboard.map(entry => entry._id);
      } else {
        return res.status(400).json({ message: 'Invalid shortlisting mode. Use "topN", "threshold", or "date"' });
      }
    }

    console.log('🔍 Backend - Submissions to shortlist:', submissionsToShortlist);

    // Update submission statuses
    const updatePromises = submissionsToShortlist.map(submissionId =>
      Submission.findByIdAndUpdate(submissionId, { 
        status: 'shortlisted',
        shortlistedAt: new Date(),
        shortlistedForRound: 2 // Round 2 (since we're shortlisting from Round 1)
      })
    );

    await Promise.all(updatePromises);

    // Update hackathon round progress
    const roundProgressIndex = hackathon.roundProgress.findIndex(rp => rp.roundIndex === parseInt(roundIndex));
    
    if (roundProgressIndex >= 0) {
      // Update existing round progress
      hackathon.roundProgress[roundProgressIndex].shortlistedSubmissions = submissionsToShortlist;
      hackathon.roundProgress[roundProgressIndex].shortlistedAt = new Date();
    } else {
      // Add new round progress
      hackathon.roundProgress.push({
        roundIndex: parseInt(roundIndex),
        shortlistedSubmissions: submissionsToShortlist,
        shortlistedAt: new Date()
      });
    }

    await hackathon.save();

    console.log('🔍 Backend - Shortlisting completed successfully');

    res.status(200).json({
      message: `Successfully shortlisted ${submissionsToShortlist.length} submissions`,
      shortlistedSubmissions: submissionsToShortlist,
      roundIndex: parseInt(roundIndex),
      shortlistedAt: new Date(),
      mode: mode
    });

  } catch (error) {
    console.error('🔍 Backend - Error performing shortlisting:', error);
    res.status(500).json({ message: 'Failed to perform shortlisting', error: error.message });
  }
};

// 🎯 Check and Auto-Progress Round 2
exports.checkAndAutoProgressRound2 = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    const now = new Date();
    const round2StartDate = hackathon.rounds?.[1]?.startDate; // Round 2 start date

    if (round2StartDate && now >= new Date(round2StartDate)) {
      // Round 2 has started, move shortlisted submissions to round 2
      const shortlistedSubmissions = await Submission.find({
        hackathonId: hackathonId,
        status: 'shortlisted',
        shortlistedForRound: 2
      });

      if (shortlistedSubmissions.length > 0) {
        // Update submissions to round 2
        await Submission.updateMany(
          { _id: { $in: shortlistedSubmissions.map(s => s._id) } },
          { 
            roundIndex: 1, // Round 2 (index 1 in the rounds array)
            status: 'submitted',
            shortlistedForRound: null // Clear shortlisting flag
          }
        );

        console.log(`🔍 Auto-progressed ${shortlistedSubmissions.length} submissions to Round 2`);
        
        return res.status(200).json({
          progressed: true,
          count: shortlistedSubmissions.length,
          message: `Successfully progressed ${shortlistedSubmissions.length} submissions to Round 2`
        });
      }
    }
    
    return res.status(200).json({
      progressed: false,
      count: 0,
      message: 'No submissions to progress or Round 2 has not started yet'
    });
  } catch (error) {
    console.error('🔍 Error in auto-progress round 2:', error);
    return res.status(500).json({ 
      message: 'Failed to check auto-progress', 
      error: error.message 
    });
  }
};

// 🎯 Get Shortlisted Submissions
exports.getShortlistedSubmissions = async (req, res) => {
  try {
    const { hackathonId, roundIndex = 1 } = req.params;
    
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    // Get shortlisted submissions
    const shortlistedSubmissions = await Submission.find({
      hackathonId: hackathonId,
      status: 'shortlisted',
      roundIndex: parseInt(roundIndex)
    }).populate('teamId', 'name leader')
      .populate('submittedBy', 'name email')
      .lean();

    // Get scores for shortlisted submissions
    const Score = require('../model/ScoreModel');
    const scores = await Score.find({ 
      submissionId: { $in: shortlistedSubmissions.map(s => s._id) } 
    }).populate('judge', 'name email').lean();

    // Create a map of submission scores
    const submissionScores = {};
    scores.forEach(score => {
      if (!submissionScores[score.submissionId.toString()]) {
        submissionScores[score.submissionId.toString()] = [];
      }
      submissionScores[score.submissionId.toString()].push(score);
    });

    // Format shortlisted submissions with scores
    const formattedSubmissions = shortlistedSubmissions.map(submission => {
      const submissionScoresList = submissionScores[submission._id.toString()] || [];
      
      let averageScore = 0;
      let totalScore = 0;
      let scoreCount = 0;
      
      submissionScoresList.forEach(score => {
        // Convert Map to object if needed
        let scoresObject = {};
        if (score.scores && score.scores instanceof Map) {
          score.scores.forEach((value, key) => {
            scoresObject[key] = value.score;
          });
        } else if (score.scores && typeof score.scores === 'object') {
          scoresObject = score.scores;
        }
        
        const criteriaScores = Object.values(scoresObject).filter(s => typeof s === 'number');
        if (criteriaScores.length > 0) {
          const submissionScore = criteriaScores.reduce((sum, s) => sum + s, 0) / criteriaScores.length;
          totalScore += submissionScore;
          scoreCount++;
        }
      });
      
      averageScore = scoreCount > 0 ? totalScore / scoreCount : 0;

      return {
        _id: submission._id,
        projectTitle: submission.projectTitle || submission.title || 'Untitled Project',
        teamName: submission.teamName || submission.teamId?.name || 'No Team',
        leaderName: submission.submittedBy?.name || submission.submittedBy?.email || 'Unknown',
        pptFile: submission.pptFile,
        submittedAt: submission.submittedAt,
        averageScore: Math.round(averageScore * 10) / 10,
        scoreCount,
        totalScore: Math.round(totalScore * 10) / 10,
        status: submission.status,
        roundIndex: submission.roundIndex
      };
    });

    // Sort by average score (descending)
    formattedSubmissions.sort((a, b) => b.averageScore - a.averageScore);

    res.status(200).json({
      hackathon: {
        id: hackathon._id,
        title: hackathon.title,
        roundIndex: parseInt(roundIndex)
      },
      shortlistedSubmissions: formattedSubmissions,
      summary: {
        totalShortlisted: formattedSubmissions.length,
        averageScore: formattedSubmissions.length > 0 
          ? Math.round(formattedSubmissions.reduce((sum, s) => sum + s.averageScore, 0) / formattedSubmissions.length * 10) / 10
          : 0
      }
    });

  } catch (error) {
    console.error('Error fetching shortlisted submissions:', error);
    res.status(500).json({ message: 'Failed to fetch shortlisted submissions' });
  }
};
