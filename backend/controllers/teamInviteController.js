const TeamInvite = require('../model/TeamInviteModel');
const Team = require('../model/TeamModel');
const User = require('../model/UserModel');
const Hackathon = require('../model/HackathonModel');
const nodemailer = require('nodemailer');

// POST /api/team-invites
const createInvite = async (req, res) => {
  try {
    const { invitedEmail, teamId, hackathonId } = req.body;
    const invitedBy = req.user._id;

    console.log('Creating invite:', { invitedEmail, teamId, hackathonId, invitedBy });

    // Validate required fields
    if (!invitedEmail || !teamId || !hackathonId) {
      return res.status(400).json({ error: 'Missing required fields: invitedEmail, teamId, hackathonId' });
    }

    // Check for existing invite
    const existing = await TeamInvite.findOne({
      team: teamId,
      invitedEmail,
      status: 'pending'
    });
    if (existing) {
      return res.status(400).json({ error: 'Invite already sent to this email' });
    }

    // Find user by email (if exists)
    const user = await User.findOne({ email: invitedEmail });
    const invite = await TeamInvite.create({
      team: teamId,
      invitedUser: user ? user._id : undefined,
      invitedEmail,
      invitedBy,
      hackathon: hackathonId,
    });

    // Send email
    const hackathon = await Hackathon.findById(hackathonId);
    const team = await Team.findById(teamId);
    const inviter = await User.findById(invitedBy);
    
    if (!hackathon || !team || !inviter) {
      return res.status(404).json({ error: 'Hackathon, team, or inviter not found' });
    }

    const inviteLink = `http://localhost:5173/invite/${invite._id}`;

    // Setup nodemailer with user's email credentials
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Team Invitation</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">You've been invited to join a hackathon team!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Hello there! 👋</h2>
          
          <p style="color: #555; line-height: 1.6;">
            <strong>${inviter.name}</strong> has invited you to join their team for the hackathon:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #667eea; margin: 0 0 10px 0;">🏆 ${hackathon.title}</h3>
            <p style="color: #666; margin: 0 0 5px 0;"><strong>Team:</strong> ${team.name}</p>
            <p style="color: #666; margin: 0 0 5px 0;"><strong>Prize Pool:</strong> $${hackathon.prizePool}</p>
            <p style="color: #666; margin: 0;"><strong>Deadline:</strong> ${new Date(hackathon.endDate).toLocaleDateString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
              🚀 Accept Invitation
            </a>
          </div>
          
          <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #0c5460; margin: 0; font-size: 14px;">
              <strong>Note:</strong> If you don't have an account yet, you'll need to register first before accepting the invitation.
            </p>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            This invitation will expire in 7 days. Don't miss out on this amazing opportunity!
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2024 HackZen. All rights reserved.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"HackZen Team" <${process.env.MAIL_USER}>`,
      to: invitedEmail,
      subject: `🎉 You're invited to join ${team.name} for ${hackathon.title}!`,
      html: emailTemplate
    });

    res.status(201).json({ message: 'Invite sent successfully', invite });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send invite', details: err.message });
  }
};

// PUT /api/team-invites/:id/respond
const respondToInvite = async (req, res) => {
  try {
    const { status } = req.body; // "accepted" or "declined"
    const inviteId = req.params.id;
    const userId = req.user._id;

    const invite = await TeamInvite.findById(inviteId);
    if (!invite) return res.status(404).json({ error: 'Invite not found' });

    if (invite.invitedUser.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You are not the invited user' });
    }

    invite.status = status;
    invite.respondedAt = new Date();
    await invite.save();

    if (status === 'accepted') {
      const team = await Team.findById(invite.team);
      if (!team.members.includes(userId)) {
        team.members.push(userId);
        await team.save();
      }
    }

    res.json({ message: `Invite ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to respond to invite', details: err.message });
  }
};

// GET /api/team-invites/my
const getMyInvites = async (req, res) => {
  try {
    const invites = await TeamInvite.find({ invitedEmail: req.user.email })
      .populate('team', 'name')
      .populate('invitedBy', 'name')
      .populate('hackathon', 'title');
    res.json(invites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invites' });
  }
};

// GET /api/team-invites/hackathon/:hackathonId
const getHackathonInvites = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get all teams for this hackathon where user is a member
    const userTeams = await Team.find({
      hackathon: hackathonId,
      members: userId
    });

    const teamIds = userTeams.map(team => team._id);

    // Get all invites for these teams
    const invites = await TeamInvite.find({
      team: { $in: teamIds },
      status: 'pending'
    })
    .populate('team', 'name')
    .populate('invitedBy', 'name email')
    .populate('hackathon', 'title');

    res.json(invites);
  } catch (err) {
    console.error('Error fetching hackathon invites:', err);
    res.status(500).json({ error: 'Failed to fetch hackathon invites', details: err.message });
  }
};

// POST /api/team-invites/:id/accept
const acceptInviteById = async (req, res) => {
  try {
    const inviteId = req.params.id;
    const userId = req.user._id;

    const invite = await TeamInvite.findById(inviteId);
    if (!invite) return res.status(404).json({ error: 'Invite not found' });

    // If not already accepted/declined
    if (invite.status !== 'pending') {
      return res.status(400).json({ error: 'Invite already responded to' });
    }

    // If invitedUser is not set, set it now
    if (!invite.invitedUser) {
      invite.invitedUser = userId;
    } else if (invite.invitedUser.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'You are not the invited user' });
    }

    invite.status = 'accepted';
    invite.respondedAt = new Date();
    await invite.save();

    // Add user to team
    const team = await Team.findById(invite.team);
    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
    }

    res.json({ message: 'Invite accepted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to accept invite', details: err.message });
  }
};

// GET /api/team-invites/:id
const getInviteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const invite = await TeamInvite.findById(id)
      .populate('team', 'name description')
      .populate('invitedBy', 'name email')
      .populate('hackathon', 'title prizePool endDate');
    
    if (!invite) {
      return res.status(404).json({ error: 'Invite not found' });
    }
    
    res.json(invite);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invite', details: err.message });
  }
};

module.exports = {
  createInvite,
  respondToInvite,
  getMyInvites,
  getHackathonInvites,
  acceptInviteById,
  getInviteById
};
