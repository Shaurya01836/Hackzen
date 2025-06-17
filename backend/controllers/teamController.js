const Team =require('../model/TeamModel');

const createTeam =async (req, res) =>{
    try{
        const {name,hackathonId}=req.body;
        const userId =req.user._id;


const newTeam = await Team.create({
  name,
  hackathon: hackathonId, // fix here
  members: [userId],
});

         res.status(201).json(newTeam);
    }
    catch(err){
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

    team.members.push(userId);
    await team.save();

    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add member', details: err.message });
  }
};

// GET /api/teams/hackathon/:hackathonId
const getTeamsByHackathon = async (req, res) => {
  try {
    const teams = await Team.find({ hackathon: req.params.hackathonId }).populate('members', 'name email');
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

// GET /api/teams/:id
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members', 'name email');
    if (!team) return res.status(404).json({ error: 'Team not found' });

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
};

// DELETE /api/teams/:id
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const userId = req.user._id.toString();
    if (team.members[0].toString() !== userId) {
      return res.status(403).json({ error: 'Only the team leader can delete the team' });
    }

    await team.remove();
    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
};

module.exports = {
  createTeam,
  addMember,
  getTeamsByHackathon,
  getTeamById,
  deleteTeam,
};