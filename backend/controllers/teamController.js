const Team = require('../model/TeamModel');
const HackathonRegistration = require('../model/HackathonRegistrationModel');
const User = require('../model/UserModel');
const Hackathon = require('../model/HackathonModel');
const Submission = require('../model/SubmissionModel'); // ✅ Added for cleaning up submissions
const crypto = require('crypto');
const mongoose = require('mongoose');

const createTeam = async (req, res) => {
  try {
    const { name, description, maxMembers, hackathonId, projectId } = req.body;
    
    console.log('Creating team:', { 
      name, 
      description, 
      maxMembers, 
      hackathonId, 
      projectId,
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

    if (!name || !description) {
      return res.status(400).json({ error: 'Missing required fields: name, description' });
    }

    // Check if creating for hackathon or project
    if (hackathonId) {
      // Validate hackathon exists
      const hackathon = await require('../model/HackathonModel').findById(new mongoose.Types.ObjectId(hackathonId));
      if (!hackathon) {
        return res.status(404).json({ error: 'Hackathon not found' });
      }

      // Check if user is already a member of any team for this hackathon
      const existingTeam = await Team.findOne({ 
        hackathon: new mongoose.Types.ObjectId(hackathonId), 
        members: new mongoose.Types.ObjectId(userId),
        status: 'active'
      });

      if (existingTeam) {
        return res.status(400).json({ 
          error: 'You are already a member of a team for this hackathon.',
          existingTeamId: existingTeam._id
        });
      }

      // Get hackathon's team size settings
      const hackathonMaxMembers = hackathon.teamSize?.max || 4;
      const finalMaxMembers = Math.min(maxMembers || hackathonMaxMembers, hackathonMaxMembers);
      
      const newTeam = await Team.create({
        name,
        description,
        teamCode: crypto.randomBytes(4).toString('hex').toUpperCase(),
        maxMembers: finalMaxMembers,
        hackathon: new mongoose.Types.ObjectId(hackathonId),
        members: [new mongoose.Types.ObjectId(userId)],
        leader: new mongoose.Types.ObjectId(userId),
      });

      const populatedTeam = await Team.findById(newTeam._id)
        .populate('members', 'name email avatar')
        .populate('leader', 'name email')
        .populate('hackathon', 'title');

      console.log('Hackathon team created successfully:', {
        teamId: populatedTeam._id,
        teamCode: populatedTeam.teamCode,
        name: populatedTeam.name
      });
      
      res.status(201).json({
        message: 'Team created successfully!',
        team: populatedTeam
      });
    } else if (projectId) {
      // Validate project exists
      const Project = require('../model/ProjectModel');
      const project = await Project.findById(new mongoose.Types.ObjectId(projectId));
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Check if user is already a member of any team for this project
      const existingTeam = await Team.findOne({ 
        project: new mongoose.Types.ObjectId(projectId), 
        members: new mongoose.Types.ObjectId(userId),
        status: 'active'
      });

      if (existingTeam) {
        return res.status(400).json({ 
          error: 'You are already a member of a team for this project.',
          existingTeamId: existingTeam._id
        });
      }

      const newTeam = await Team.create({
        name,
        description,
        teamCode: crypto.randomBytes(4).toString('hex').toUpperCase(),
        maxMembers: maxMembers || 4,
        project: new mongoose.Types.ObjectId(projectId),
        members: [new mongoose.Types.ObjectId(userId)],
        leader: new mongoose.Types.ObjectId(userId),
      });

      const populatedTeam = await Team.findById(newTeam._id)
        .populate('members', 'name email avatar')
        .populate('leader', 'name email')
        .populate('project', 'title');

      console.log('Project team created successfully:', {
        teamId: populatedTeam._id,
        teamCode: populatedTeam.teamCode,
        name: populatedTeam.name
      });
      
      res.status(201).json({
        message: 'Team created successfully!',
        team: populatedTeam
      });
    } else {
      return res.status(400).json({ error: 'Either hackathonId or projectId is required' });
    }
  } catch (err) {
    console.error('Error creating team:', err);
    res.status(500).json({ error: 'Failed to create team', details: err.message });
  }
};

// PUT /api/teams/:id/add-member
const addMember = async (req, res) => {
  try {
    const team = await Team.findById(new mongoose.Types.ObjectId(req.params.id));
    if (!team) return res.status(404).json({ error: 'Team not found' });

    const userId = req.user._id;

    if (team.members.includes(new mongoose.Types.ObjectId(userId))) {
      return res.status(400).json({ error: 'User already in team' });
    }

    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ error: 'Team is full' });
    }

    team.members.push(new mongoose.Types.ObjectId(userId));
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
      hackathon: new mongoose.Types.ObjectId(hackathonId),
      members: new mongoose.Types.ObjectId(userId),
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

// GET /api/teams/project/:projectId
const getTeamsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    console.log('getTeamsByProject called with:', { 
      projectId, 
      userId: req.user?._id,
      userExists: !!req.user
    });

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      console.error('Authentication error: req.user is', req.user);
      return res.status(401).json({ error: 'User not authenticated. Please log in again.' });
    }

    const userId = req.user._id;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Get teams where the user is a member for this project
    const userTeams = await Team.find({ 
      project: new mongoose.Types.ObjectId(projectId),
      members: new mongoose.Types.ObjectId(userId),
      status: 'active'
    })
    .populate('members', 'name email avatar')
    .populate('leader', 'name email')
    .populate('project', 'title')
    .sort({ createdAt: -1 });

    console.log('Found project teams:', userTeams.length);

    res.json(userTeams);
  } catch (err) {
    console.error('Error fetching project teams:', err);
    res.status(500).json({ error: 'Failed to fetch project teams', details: err.message });
  }
};

// GET /api/teams/:id
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(new mongoose.Types.ObjectId(req.params.id))
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
    const { hackathonId, projectId } = req.query;
    const userId = req.user._id;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const team = await Team.findOne({ teamCode, status: 'active' });
    if (!team) {
      return res.status(404).json({ error: 'Team not found or inactive' });
    }

    if (team.members.includes(new mongoose.Types.ObjectId(userId))) {
      return res.status(400).json({ error: 'You are already a member of this team' });
    }

    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ error: 'Team is full' });
    }

    // Add user to team
    team.members.push(new mongoose.Types.ObjectId(userId));
    await team.save();

    let registrationStatus = 'not_applicable';
    let populatedTeam;

    // Handle hackathon registration if applicable
    if (team.hackathon) {
      const existingReg = await HackathonRegistration.findOne({ hackathonId: new mongoose.Types.ObjectId(team.hackathon), userId });
      registrationStatus = 'already_registered';
      
      if (!existingReg) {
        try {
          // Get user info for autofill
          const user = await User.findById(userId);
          const hackathon = await Hackathon.findById(new mongoose.Types.ObjectId(team.hackathon));
          
          if (!hackathon) {
            throw new Error('Hackathon not found');
          }
          
          // Create registration
          await HackathonRegistration.create({
            hackathonId: new mongoose.Types.ObjectId(team.hackathon),
            userId,
            formData: {
              fullName: user.name,
              email: user.email,
              phone: user.phone || '',
              teamName: team.name,
              teamCode: teamCode.toUpperCase(),
              acceptedTerms: true
            },
            acceptedTerms: true
          });
          
          // Update Hackathon participants
          if (!hackathon.participants.includes(new mongoose.Types.ObjectId(userId))) {
            hackathon.participants.push(new mongoose.Types.ObjectId(userId));
            await hackathon.save();
          }
          
          // Update User's registeredHackathonIds
          await User.findByIdAndUpdate(userId, {
            $addToSet: { registeredHackathonIds: new mongoose.Types.ObjectId(team.hackathon) },
          });
          
          registrationStatus = 'registered';
        } catch (regError) {
          console.error('Auto-registration failed:', regError);
          registrationStatus = 'registration_failed';
        }
      }

      populatedTeam = await Team.findById(team._id)
        .populate('members', 'name email avatar')
        .populate('leader', 'name email')
        .populate('hackathon', 'title');
    } else if (team.project) {
      // For project teams, no registration needed
      populatedTeam = await Team.findById(team._id)
        .populate('members', 'name email avatar')
        .populate('leader', 'name email')
        .populate('project', 'title');
    }

    res.json({ 
      message: 'Successfully joined team', 
      team: populatedTeam,
      registrationStatus 
    });
  } catch (err) {
    console.error('Error joining team:', err);
    res.status(500).json({ error: 'Failed to join team', details: err.message });
  }
};

// DELETE /api/teams/:id
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(new mongoose.Types.ObjectId(req.params.id));
    if (!team) return res.status(404).json({ error: 'Team not found' });

    // Only the leader can delete the team
    const userId = req.user._id.toString();
    if (team.leader.toString() !== userId) {
      return res.status(403).json({ error: 'Only the team leader can delete the team' });
    }

    // Optionally: Unregister all members from the hackathon when the team is deleted
    const hackathonId = team.hackathon;
    for (const memberId of team.members) {
      // Remove registration
      await HackathonRegistration.deleteOne({ hackathonId: new mongoose.Types.ObjectId(hackathonId), userId: new mongoose.Types.ObjectId(memberId) });
      // Remove from hackathon participants
      await Hackathon.findByIdAndUpdate(new mongoose.Types.ObjectId(hackathonId), { $pull: { participants: new mongoose.Types.ObjectId(memberId) } });
      // Remove from user's registeredHackathonIds
      await User.findByIdAndUpdate(memberId, { $pull: { registeredHackathonIds: new mongoose.Types.ObjectId(hackathonId) } });
      // ✅ Clean up submissions for this user and hackathon
      await Submission.deleteMany({ hackathonId: new mongoose.Types.ObjectId(hackathonId), submittedBy: new mongoose.Types.ObjectId(memberId) });
    }

    await Team.findByIdAndDelete(new mongoose.Types.ObjectId(req.params.id));
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
    const team = await Team.findById(new mongoose.Types.ObjectId(teamId));
    if (!team) return res.status(404).json({ error: 'Team not found' });

    // Only leader can remove members
    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the team leader can remove members' });
    }

    // Leader cannot remove themselves
    if (memberId === team.leader.toString()) {
      return res.status(400).json({ error: 'Leader cannot remove themselves' });
    }

    // Check if member exists in team
    if (!team.members.includes(new mongoose.Types.ObjectId(memberId))) {
      return res.status(400).json({ error: 'Member is not in this team' });
    }

    // Remove member from team
    team.members = team.members.filter(id => id.toString() !== memberId);
    await team.save();

    // Unregister the removed member from the hackathon
    const hackathonId = team.hackathon;
    
    // Remove registration
    await HackathonRegistration.deleteOne({ hackathonId: new mongoose.Types.ObjectId(hackathonId), userId: new mongoose.Types.ObjectId(memberId) });
    
    // Remove from hackathon participants
    await Hackathon.findByIdAndUpdate(new mongoose.Types.ObjectId(hackathonId), { $pull: { participants: new mongoose.Types.ObjectId(memberId) } });
    
    // Remove from user's registeredHackathonIds
    await User.findByIdAndUpdate(memberId, { $pull: { registeredHackathonIds: new mongoose.Types.ObjectId(hackathonId) } });

    // ✅ Clean up submissions for this user and hackathon
    await Submission.deleteMany({ hackathonId: new mongoose.Types.ObjectId(hackathonId), submittedBy: new mongoose.Types.ObjectId(memberId) });

    const populatedTeam = await Team.findById(team._id)
      .populate('members', 'name email avatar')
      .populate('leader', 'name email');

    res.json({ 
      message: 'Member removed successfully and unregistered from the hackathon', 
      team: populatedTeam 
    });
  } catch (err) {
    console.error('Error removing member:', err);
    res.status(500).json({ error: 'Failed to remove member', details: err.message });
  }
};

// PUT /api/teams/:teamId/description
const updateTeamDescription = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { description } = req.body;
    const userId = req.user._id;

    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const team = await Team.findById(new mongoose.Types.ObjectId(teamId));
    if (!team) return res.status(404).json({ error: 'Team not found' });

    // Only the leader can update team description
    if (team.leader.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Only the team leader can update team description' });
    }

    team.description = description.trim();
    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('members', 'name email avatar')
      .populate('leader', 'name email')
      .populate('hackathon', 'title');

    res.json({ 
      message: 'Team description updated successfully', 
      team: populatedTeam 
    });
  } catch (err) {
    console.error('Error updating team description:', err);
    res.status(500).json({ error: 'Failed to update team description', details: err.message });
  }
};

// PUT /api/teams/:teamId/name
const updateTeamName = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name } = req.body;
    const userId = req.user._id;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const team = await Team.findById(new mongoose.Types.ObjectId(teamId));
    if (!team) return res.status(404).json({ error: 'Team not found' });

    // Only the leader can update team name
    if (team.leader.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Only the team leader can update team name' });
    }

    team.name = name.trim();
    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('members', 'name email avatar')
      .populate('leader', 'name email')
      .populate('hackathon', 'title');

    res.json({ 
      message: 'Team name updated successfully', 
      team: populatedTeam 
    });
  } catch (err) {
    console.error('Error updating team name:', err);
    res.status(500).json({ error: 'Failed to update team name', details: err.message });
  }
};

// DELETE /api/teams/:teamId/leave
const leaveTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user._id;
    const team = await Team.findById(new mongoose.Types.ObjectId(teamId));
    if (!team) return res.status(404).json({ error: 'Team not found' });
    if (!team.members.includes(new mongoose.Types.ObjectId(userId))) {
      return res.status(403).json({ error: 'You are not a member of this team' });
    }
    // Remove member from team
    team.members = team.members.filter(id => id.toString() !== userId.toString());
    await team.save();

    // Unregister user from hackathon if they leave the team
    const hackathonId = team.hackathon;
    // Remove registration
    await HackathonRegistration.deleteOne({ hackathonId: new mongoose.Types.ObjectId(hackathonId), userId: new mongoose.Types.ObjectId(userId) });
    // Remove from hackathon participants
    await Hackathon.findByIdAndUpdate(new mongoose.Types.ObjectId(hackathonId), { $pull: { participants: new mongoose.Types.ObjectId(userId) } });
    // Remove from user's registeredHackathonIds
    await User.findByIdAndUpdate(userId, { $pull: { registeredHackathonIds: new mongoose.Types.ObjectId(hackathonId) } });

    // ✅ Clean up submissions for this user and hackathon
    await Submission.deleteMany({ hackathonId: new mongoose.Types.ObjectId(hackathonId), submittedBy: new mongoose.Types.ObjectId(userId) });

    res.json({ message: 'You have left the team and have been unregistered from the hackathon.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to leave team', details: err.message });
  }
};

// GET /api/teams/hackathon/:hackathonId/all
const getAllTeamsByHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    if (!hackathonId) {
      return res.status(400).json({ error: 'Hackathon ID is required' });
    }
    // Get all teams for this hackathon
    const allTeams = await Team.find({
      hackathon: new mongoose.Types.ObjectId(hackathonId),
      status: 'active'
    })
      .populate('members', 'name email avatar')
      .populate('leader', 'name email')
      .populate('hackathon', 'title')
      .sort({ createdAt: -1 });
    res.json(allTeams);
  } catch (err) {
    console.error('Error fetching all teams:', err);
    res.status(500).json({ error: 'Failed to fetch all teams', details: err.message });
  }
};

// GET /api/teams/hackathon/:hackathonId/teams-with-submissions
const getTeamsWithSubmissions = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    
    // Get all teams for this hackathon
    const teams = await Team.find({ hackathon: new mongoose.Types.ObjectId(hackathonId) })
      .populate('members', 'name email profileImage')
      .populate('leader', 'name email profileImage')
      .sort({ createdAt: -1 });

    // Get all submissions for this hackathon
    const Submission = require('../model/SubmissionModel');
    const submissions = await Submission.find({ hackathonId })
      .populate('submittedBy', 'name email')
      .populate('projectId', 'title description')
      .sort({ submittedAt: -1 });

    // Create a map of team submissions by teamId
    const teamSubmissionsMap = {};
    submissions.forEach(sub => {
      // Find which team this submission belongs to
      const team = teams.find(t => 
        t.members.some(member => member._id.toString() === sub.submittedBy._id.toString())
      );
      
      if (team) {
        const teamId = team._id.toString();
        if (!teamSubmissionsMap[teamId]) {
          teamSubmissionsMap[teamId] = [];
        }
        teamSubmissionsMap[teamId].push({
          id: sub._id,
          problemStatement: sub.problemStatement,
          submissionType: sub.pptFile ? 'PPT' : 'Project',
          submittedAt: sub.submittedAt,
          status: sub.status,
          projectTitle: sub.projectId?.title || 'PPT Submission',
          submittedBy: sub.submittedBy.name
        });
      }
    });

    // Format the response with submission data
    const teamsWithSubmissions = teams.map(team => {
      const teamId = team._id.toString();
      const teamSubmissions = teamSubmissionsMap[teamId] || [];

      return {
        _id: team._id,
        id: team._id, // Include both for compatibility
        name: team.name,
        leader: team.leader,
        members: team.members,
        hackathon: team.hackathon,
        status: team.status,
        createdAt: team.createdAt,
        // Add submission information
        submissions: teamSubmissions,
        hasSubmitted: teamSubmissions.length > 0,
        submittedProblemStatements: teamSubmissions.map(sub => sub.problemStatement).filter(Boolean)
      };
    });

    // Calculate analytics with problem statement breakdown
    const problemStatementStats = {};
    teamsWithSubmissions.forEach(team => {
      team.submittedProblemStatements.forEach(ps => {
        if (!problemStatementStats[ps]) {
          problemStatementStats[ps] = 0;
        }
        problemStatementStats[ps]++;
      });
    });

    const analytics = {
      totalTeams: teamsWithSubmissions.length,
      teamsWithSubmissions: teamsWithSubmissions.filter(t => t.hasSubmitted).length,
      problemStatementStats: Object.entries(problemStatementStats).map(([ps, count]) => ({
        problemStatement: ps,
        teamCount: count
      })).sort((a, b) => b.teamCount - a.teamCount)
    };

    res.json({
      teams: teamsWithSubmissions,
      analytics
    });
  } catch (err) {
    console.error('Error fetching teams with submissions:', err);
    res.status(500).json({ error: 'Failed to fetch teams with submissions', details: err.message });
  }
};

module.exports = {
  createTeam,
  addMember,
  getTeamsByHackathon,
  getTeamsByProject,
  getTeamById,
  joinTeamByCode,
  deleteTeam,
  removeMember,
  leaveTeam,
  updateTeamDescription,
  updateTeamName,
  getAllTeamsByHackathon,
  getTeamsWithSubmissions,
};