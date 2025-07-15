const mongoose = require("mongoose");
const Registration = require("../model/HackathonRegistrationModel");
const Hackathon = require("../model/HackathonModel");
const User = require("../model/UserModel"); // ✅ required for syncing
const Team = require("../model/TeamModel");
const Submission = require("../model/SubmissionModel"); // ✅ Added for cleaning up submissions

const registerForHackathon = async (req, res) => {
  try {
    const { hackathonId, formData } = req.body;
    const userId = req.user._id.toString();

    // Validate
    if (!mongoose.Types.ObjectId.isValid(hackathonId)) {
      return res.status(400).json({ message: "Invalid hackathon ID." });
    }
    const existing = await Registration.findOne({ hackathonId, userId });
    if (existing) {
      return res.status(400).json({ message: "Already registered." });
    }
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found." });
    }
    if (new Date() > new Date(hackathon.registrationDeadline)) {
      return res.status(400).json({ message: "Registration deadline has passed." });
    }
    if (hackathon.participants.length >= hackathon.maxParticipants) {
      return res.status(400).json({ message: "Registration closed. Max participants reached." });
    }
    if (!formData.teamName || !formData.teamName.trim()) {
      return res.status(400).json({ message: "Team name is required for registration." });
    }

    // Registration
    const registration = await Registration.create({
      hackathonId,
      userId,
      formData,
      acceptedTerms: formData.acceptedTerms,
    });

    hackathon.participants.push(userId);
    await hackathon.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { registeredHackathonIds: hackathonId },
    });

    // Team creation
    let newTeam = null;
    try {
      const crypto = require('crypto');
      const teamCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      
      // Use hackathon's team size settings
      const maxMembers = hackathon.teamSize?.max || 4;
      
      newTeam = await Team.create({
        name: formData.teamName.trim(),
        description: formData.teamDescription || "Write your Team Description here.",
        teamCode,
        maxMembers: maxMembers,
        hackathon: hackathonId,
        members: [userId],
        leader: userId,
        status: 'active'
      });
      console.log('Team created:', newTeam);
      hackathon.teams.push(newTeam._id);
      await hackathon.save();
    } catch (err) {
      console.error('Error creating team:', err);
      return res.status(500).json({ success: false, message: 'Failed to create team: ' + err.message });
    }

    res.status(201).json({ 
      success: true, 
      registration,
      team: newTeam
        ? {
            id: newTeam._id,
            name: newTeam.name,
            teamCode: newTeam.teamCode,
            description: newTeam.description
          }
        : null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const registrations = await Registration.find({ userId }).populate("hackathonId");

    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's last registration data for auto-filling
const getLastRegistrationData = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    // Get the most recent registration
    const lastRegistration = await Registration.findOne({ userId })
      .sort({ createdAt: -1 })
      .select('formData');

    if (!lastRegistration) {
      return res.json({ 
        hasPreviousRegistration: false, 
        formData: null 
      });
    }

    res.json({ 
      hasPreviousRegistration: true, 
      formData: lastRegistration.formData 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getHackathonParticipants = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(hackathonId)) {
      return res.status(400).json({ message: "Invalid hackathon ID." });
    }

    // Check if hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found." });
    }

    // Get all registrations for this hackathon with user details
    const registrations = await Registration.find({ hackathonId })
      .populate('userId', 'name email avatar location createdAt')
      .sort({ createdAt: -1 });

    // Format the response
    const participants = registrations.map(reg => ({
      id: reg._id,
      userId: reg.userId._id,
      name: reg.formData.fullName || reg.userId.name,
      email: reg.formData.email || reg.userId.email,
      avatar: reg.userId.avatar,
      location: reg.formData.collegeOrCompany || reg.userId.location || 'Not specified',
      joinedDate: reg.createdAt,
      phone: reg.formData.phone,
      age: reg.formData.age,
      gender: reg.formData.gender,
      collegeOrCompany: reg.formData.collegeOrCompany,
      degreeOrRole: reg.formData.degreeOrRole,
      yearOfStudyOrExperience: reg.formData.yearOfStudyOrExperience,
      teamName: reg.formData.teamName,
      teamCode: reg.formData.teamCode,
      projectIdea: reg.formData.projectIdea,

      github: reg.formData.github,
      linkedin: reg.formData.linkedin,
      resumeURL: reg.formData.resumeURL,
      heardFrom: reg.formData.heardFrom,
      registrationDate: reg.createdAt
    }));

    // Calculate analytics
    const analytics = {
      totalParticipants: participants.length,
      activeParticipants: participants.length, // All registered participants are considered active
      newThisMonth: participants.filter(p => {
        const registrationDate = new Date(p.registrationDate);
        const now = new Date();
        return registrationDate.getMonth() === now.getMonth() && 
               registrationDate.getFullYear() === now.getFullYear();
      }).length,
      averageAge: participants.length > 0 ? 
        Math.round(participants.reduce((sum, p) => sum + (parseInt(p.age) || 0), 0) / participants.length) : 0,
      topCountries: participants.reduce((acc, p) => {
        const location = p.location || 'Unknown';
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {}),
      skillDistribution: {} // Track field removed
    };

    // Convert to array format for frontend
    analytics.topCountries = Object.entries(analytics.topCountries)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    analytics.skillDistribution = Object.entries(analytics.skillDistribution)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      participants,
      analytics,
      hackathon: {
        id: hackathon._id,
        title: hackathon.title,
        description: hackathon.description,
        startDate: hackathon.startDate,
        endDate: hackathon.endDate,
        maxParticipants: hackathon.maxParticipants,
        status: hackathon.status,
        category: hackathon.category,
        difficultyLevel: hackathon.difficultyLevel,
        location: hackathon.location,
        mode: hackathon.mode,
        prizePool: hackathon.prizePool
      }
    });
  } catch (err) {
    console.error("Error getting hackathon participants:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/registration/:hackathonId
const unregisterFromHackathon = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const userId = req.user._id;

    // Check if user is a team leader for this hackathon
    const team = await Team.findOne({ 
      hackathon: hackathonId, 
      leader: userId,
      status: 'active'
    });

    if (team) {
      // User is a team leader - delete the entire team and unregister all members
      console.log(`Team leader ${userId} unregistering from hackathon ${hackathonId}. Deleting team ${team._id}`);
      
      // Unregister all team members from the hackathon
      for (const memberId of team.members) {
        // Remove registration
        await Registration.deleteOne({ hackathonId, userId: memberId });
        // Remove from hackathon participants
        await Hackathon.findByIdAndUpdate(hackathonId, { $pull: { participants: memberId } });
        // Remove from user's registeredHackathonIds
        await User.findByIdAndUpdate(memberId, { $pull: { registeredHackathonIds: hackathonId } });
        // ✅ Clean up submissions for this user and hackathon
        await Submission.deleteMany({ hackathonId, submittedBy: memberId });
      }

      // Delete the team
      await Team.findByIdAndDelete(team._id);

      res.json({ 
        message: 'You have been unregistered from the hackathon and your team has been deleted.',
        teamDeleted: true
      });
    } else {
      // User is not a team leader - just unregister them
      console.log(`Team member ${userId} unregistering from hackathon ${hackathonId}`);
      
      // Check if user is a member of any team for this hackathon
      const memberTeam = await Team.findOne({ 
        hackathon: hackathonId, 
        members: userId,
        status: 'active'
      });

      if (memberTeam) {
        // Remove user from team
        memberTeam.members = memberTeam.members.filter(id => id.toString() !== userId.toString());
        await memberTeam.save();
      }

      // Remove registration
      await Registration.deleteOne({ hackathonId, userId });

      // Remove from hackathon participants
      await Hackathon.findByIdAndUpdate(hackathonId, { $pull: { participants: userId } });

      // Remove from user's registeredHackathonIds
      await User.findByIdAndUpdate(userId, { $pull: { registeredHackathonIds: hackathonId } });

      // ✅ Clean up submissions for this user and hackathon
      await Submission.deleteMany({ hackathonId, submittedBy: userId });

      res.json({ 
        message: 'You have been unregistered from the hackathon.',
        teamDeleted: false
      });
    }
  } catch (err) {
    console.error('Error unregistering from hackathon:', err);
    res.status(500).json({ error: 'Failed to unregister from hackathon', details: err.message });
  }
};

// Update registration details
const updateRegistration = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const { formData } = req.body;
    const userId = req.user._id.toString();

    // Validate hackathon ID
    if (!mongoose.Types.ObjectId.isValid(hackathonId)) {
      return res.status(400).json({ message: "Invalid hackathon ID." });
    }

    // Check if user is registered for this hackathon
    const existingRegistration = await Registration.findOne({ hackathonId, userId });
    if (!existingRegistration) {
      return res.status(404).json({ message: "Registration not found." });
    }

    // Check if hackathon exists and registration is still open
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found." });
    }

    if (new Date() > new Date(hackathon.registrationDeadline)) {
      return res.status(400).json({ message: "Registration deadline has passed." });
    }

    // Validate required fields
    if (!formData.teamName || !formData.teamName.trim()) {
      return res.status(400).json({ message: "Team name is required." });
    }

    // Update the registration
    const updatedRegistration = await Registration.findByIdAndUpdate(
      existingRegistration._id,
      {
        formData: {
          ...existingRegistration.formData,
          ...formData
        },
        acceptedTerms: formData.acceptedTerms
      },
      { new: true }
    );

    // Update team information if team name changed
    const team = await Team.findOne({ 
      hackathon: hackathonId, 
      leader: userId,
      status: 'active'
    });

    if (team && team.name !== formData.teamName.trim()) {
      team.name = formData.teamName.trim();
      team.description = formData.teamDescription || team.description;
      await team.save();
    }

    res.json({ 
      success: true, 
      message: "Registration updated successfully",
      registration: updatedRegistration
    });
  } catch (err) {
    console.error('Error updating registration:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerForHackathon,
  getMyRegistrations,
  getHackathonParticipants,
  unregisterFromHackathon,
  getLastRegistrationData,
  updateRegistration,
};
