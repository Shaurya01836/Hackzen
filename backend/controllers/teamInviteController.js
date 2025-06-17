const TeamInvite = require('../model/TeamInviteModel');
const Team = require('../model/TeamModel');

// POST /api/team-invites
const createInvite = async (req, res) => {
  try {
    const { invitedUser, teamId, hackathonId } = req.body;
    const invitedBy = req.user._id;

    // prevent duplicates
    const existing = await TeamInvite.findOne({
      team: teamId,
      invitedUser,
      status: 'pending'
    });

    if (existing) {
      return res.status(400).json({ error: 'Invite already sent to this user' });
    }

    const invite = await TeamInvite.create({
      team: teamId,
      invitedUser,
      invitedBy,
      hackathon: hackathonId,
    });

    res.status(201).json(invite);
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
    const invites = await TeamInvite.find({ invitedUser: req.user._id })
      .populate('team', 'name')
      .populate('invitedBy', 'name')
      .populate('hackathon', 'title');
    res.json(invites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invites' });
  }
};

module.exports = {
  createInvite,
  respondToInvite,
  getMyInvites
};
