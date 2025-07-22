const JudgeAssignment = require('../model/JudgeAssignmentModel');
const Hackathon = require('../model/HackathonModel');
const User = require('../model/UserModel');
const RoleInvite = require('../model/RoleInviteModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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
      let { judgeEmail, judgeType, sponsorCompany, problemStatementIds, roundIndices } = assignment;

      // If problemStatementIds is empty or not provided, assign all eligible PS
      if (!Array.isArray(problemStatementIds) || problemStatementIds.length === 0) {
        if (judgeType === 'platform') {
          // All general problem statements
          problemStatementIds = hackathon.problemStatements
            .filter(ps => ps.type === 'general')
            .map(ps => ps._id.toString());
        } else if (judgeType === 'sponsor') {
          // All sponsored PS for their company
          problemStatementIds = hackathon.problemStatements
            .filter(ps => ps.type === 'sponsored' && ps.sponsorCompany === sponsorCompany)
            .map(ps => ps._id.toString());
        } else if (judgeType === 'hybrid') {
          // All problem statements
          problemStatementIds = hackathon.problemStatements.map(ps => ps._id.toString());
        }
      }

      // Validate judge type and permissions
      const validationResult = validateJudgeAssignment(
        judgeType,
        sponsorCompany,
        problemStatementIds,
        hackathon.problemStatements
      );

      if (!validationResult.isValid) {
        results.push({
          judgeEmail,
          success: false,
          error: validationResult.error
        });
        continue;
      }

      // Create or update judge assignment
      const judgeAssignment = await JudgeAssignment.findOneAndUpdate(
        {
          hackathon: hackathonId,
          'judge.email': judgeEmail
        },
        {
          hackathon: hackathonId,
          judge: {
            email: judgeEmail,
            type: judgeType,
            sponsorCompany: judgeType === 'sponsor' ? sponsorCompany : null,
            canJudgeSponsoredPS: judgeType === 'hybrid' || (judgeType === 'platform' && assignment.canJudgeSponsoredPS)
          },
          assignedProblemStatements: problemStatementIds.map(psId => {
            const ps = hackathon.problemStatements.find(p => p._id.toString() === psId);
            return {
              problemStatementId: psId,
              problemStatement: ps.statement,
              type: ps.type,
              sponsorCompany: ps.sponsorCompany,
              isAssigned: true
            };
          }),
          assignedRounds: roundIndices ? roundIndices.map((roundIndex, idx) => ({
            roundIndex,
            roundName: hackathon.rounds[roundIndex]?.name || `Round ${roundIndex + 1}`,
            roundType: hackathon.rounds[roundIndex]?.type || 'project',
            isAssigned: true
          })) : [],
          permissions: {
            canJudgeGeneralPS: judgeType !== 'sponsor',
            canJudgeSponsoredPS: judgeType === 'sponsor' || judgeType === 'hybrid' || assignment.canJudgeSponsoredPS,
            canJudgeAllRounds: true,
            maxSubmissionsPerJudge: assignment.maxSubmissionsPerJudge || 50
          },
          assignedBy: req.user.id,
          status: 'pending'
        },
        { upsert: true, new: true }
      );

      // === Unified RoleInvite System ===
      // Check if RoleInvite exists for this judge/hackathon/role
      let invite = await RoleInvite.findOne({
        email: judgeEmail,
        hackathon: hackathonId,
        role: 'judge',
        status: 'pending'
      });
      if (!invite) {
        // Generate invite token
        const token = crypto.randomBytes(32).toString('hex');
        invite = await RoleInvite.create({
          email: judgeEmail,
          hackathon: hackathonId,
          role: 'judge',
          token
        });
        // Send invite email using the unified system
        await sendRoleInviteEmail(judgeEmail, 'judge', token, hackathon);
      } else {
        console.log(`Judge invite already exists for: ${judgeEmail}`);
      }

      results.push({
        judgeEmail,
        success: true,
        assignmentId: judgeAssignment._id
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
exports.getAvailableJudges = async (req, res) => {
  try {
    const { hackathonId, problemStatementId } = req.params;

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
          <h4 style="color: #0c5460; margin: 0 0 10px 0;">${roleDisplay} Responsibilities:</h4>
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