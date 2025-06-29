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
    const inviteLink = `http://localhost:5173/invite/${invite._id}`; // adjust for your frontend

    // Setup nodemailer (use your SMTP config)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: invitedEmail,
      subject: `You're invited to join a team for ${hackathon.title}`,
      html: `
        <p>You have been invited to join a team for <b>${hackathon.title}</b>.</p>
        <p>Click <a href="${inviteLink}">here</a> to accept the invitation.</p>
        <p>If you don't have an account, please register first.</p>
      `
    });

    res.status(201).json({ message: 'Invite sent', invite });
  } catch (err) {
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

module.exports = {
  createInvite,
  respondToInvite,
  getMyInvites,
  acceptInviteById
};
