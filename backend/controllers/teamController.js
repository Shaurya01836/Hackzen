const Team = require('../model/TeamModel');
const crypto = require('crypto');

const createTeam = async (req, res) => {
  try {
    const { name, description, maxMembers, hackathonId } = req.body;
    
    console.log('Creating team:', { 
      name, 
      description, 
      maxMembers, 
      hackathonId, 
      userId: req.user?._id,
      userExists: !!req.user,
      headers: req.headers.authorization ? 'Bearer token present' : 'No auth header'
    });

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      console.error('Authentication error: req.user is', req.user);
      return res.status(401).json({ error: 'User not authenticated. Please log in again.' });
    }

    const userId = req.user._id;

    if (!name || !description || !hackathonId) {
      return res.status(400).json({ error: 'Missing required fields: name, description, hackathonId' });
    }

    // Validate hackathon exists
    const hackathon = await require('../model/HackathonModel').findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ error: 'Hackathon not found' });
    }

    // Generate unique team code
    const teamCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const newTeam = await Team.create({
      name,
      description,
      teamCode,
      maxMembers: maxMembers || 4,
      hackathon: hackathonId,
      members: [userId],
      leader: userId,
    });

    const populatedTeam = await Team.findById(newTeam._id)
      .populate('members', 'name email avatar')
      .populate('leader', 'name email')
      .populate('hackathon', 'title');

    console.log('Team created successfully:', {
      teamId: populatedTeam._id,
      teamCode: populatedTeam.teamCode,
      name: populatedTeam.name
    });
    
    res.status(201).json({
      message: 'Team created successfully!',
      team: populatedTeam
    });
  } catch (err) {
    console.error('Error creating team:', err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Team name already exists for this hackathon' });
    }
    res.status(500).json({ error: 'Failed to create team', details: err.message });
  }
};

// PUT /api/teams/:id/add-member
const addMember = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const userId = req.user._id;

    if (team.members.includes(userId)) {
      return res.status(400).json({ error: 'User already in team' });
    }

    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ error: 'Team is full' });
    }

    team.members.push(userId);
    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('members', 'name email avatar')
      .populate('leader', 'name email');

    res.status(200).json(populatedTeam);
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ error: 'Failed to add member', details: err.message });
  }
};

// GET /api/teams/hackathon/:hackathonId
const getTeamsByHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    
    console.log('getTeamsByHackathon called with:', { 
      hackathonId, 
      userId: req.user?._id,
      userExists: !!req.user,
      headers: req.headers.authorization ? 'Bearer token present' : 'No auth header'
    });

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      console.error('Authentication error: req.user is', req.user);
      return res.status(401).json({ error: 'User not authenticated. Please log in again.' });
    }

    const userId = req.user._id;

    if (!hackathonId) {
      return res.status(400).json({ error: 'Hackathon ID is required' });
    }

    // Get teams where the user is a member
    const userTeams = await Team.find({ 
      hackathon: hackathonId,
      members: userId,
      status: 'active'
    })
    .populate('members', 'name email avatar')
    .populate('leader', 'name email')
    .populate('hackathon', 'title')
    .sort({ createdAt: -1 });

    console.log('Found teams:', userTeams.length);

    res.json(userTeams);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ error: 'Failed to fetch teams', details: err.message });
  }
};

// GET /api/teams/:id
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('members', 'name email avatar')
      .populate('leader', 'name email')
      .populate('hackathon', 'title');
    
    if (!team) return res.status(404).json({ error: 'Team not found' });

    res.json(team);
  } catch (err) {
    console.error('Error fetching team:', err);
    res.status(500).json({ error: 'Failed to fetch team', details: err.message });
  }
};

// GET /api/teams/join/:teamCode
const joinTeamByCode = async (req, res) => {
  try {
    const { teamCode } = req.params;
    const userId = req.user._id;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const team = await Team.findOne({ teamCode, status: 'active' });
    if (!team) {
      return res.status(404).json({ error: 'Team not found or inactive' });
    }

    if (team.members.includes(userId)) {
      return res.status(400).json({ error: 'You are already a member of this team' });
    }

    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ error: 'Team is full' });
    }

    team.members.push(userId);
    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('members', 'name email avatar')
      .populate('leader', 'name email')
      .populate('hackathon', 'title');

    res.json({ message: 'Successfully joined team', team: populatedTeam });
  } catch (err) {
    console.error('Error joining team:', err);
    res.status(500).json({ error: 'Failed to join team', details: err.message });
  }
};

// DELETE /api/teams/:id
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const userId = req.user._id.toString();
    if (team.leader.toString() !== userId) {
      return res.status(403).json({ error: 'Only the team leader can delete the team' });
    }

    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    console.error('Error deleting team:', err);
    res.status(500).json({ error: 'Failed to delete team', details: err.message });
  }
};

// DELETE /api/teams/:teamId/members/:memberId
const removeMember = async (req, res) => {
  try {
    const { teamId, memberId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    // Only leader can remove members
    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the team leader can remove members' });
    }

    // Leader cannot remove themselves
    if (memberId === team.leader.toString()) {
      return res.status(400).json({ error: 'Leader cannot remove themselves' });
    }

    // Remove member
    team.members = team.members.filter(id => id.toString() !== memberId);
    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('members', 'name email avatar')
      .populate('leader', 'name email');

    res.json({ message: 'Member removed successfully', team: populatedTeam });
  } catch (err) {
    console.error('Error removing member:', err);
    res.status(500).json({ error: 'Failed to remove member', details: err.message });
  }
};

module.exports = {
  createTeam,
  addMember,
  getTeamsByHackathon,
  getTeamById,
  joinTeamByCode,
  deleteTeam,
  removeMember,
};