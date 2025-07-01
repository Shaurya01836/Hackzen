const mongoose = require("mongoose");
const Registration = require("../model/HackathonRegistrationModel");
const Hackathon = require("../model/HackathonModel");
const User = require("../model/UserModel"); // ✅ required for syncing

const registerForHackathon = async (req, res) => {
  try {
    const { hackathonId, formData } = req.body;
    const userId = req.user._id.toString();

    // ✅ Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(hackathonId)) {
      return res.status(400).json({ message: "Invalid hackathon ID." });
    }

    // ✅ Check if already registered
    const existing = await Registration.findOne({ hackathonId, userId });
    if (existing) {
      return res.status(400).json({ message: "Already registered." });
    }

    // ✅ Fetch the hackathon
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found." });
    }

    // ✅ Prevent late registrations
    if (new Date() > new Date(hackathon.registrationDeadline)) {
      return res.status(400).json({ message: "Registration deadline has passed." });
    }

    // ✅ Check if maxParticipants is reached
    if (hackathon.participants.length >= hackathon.maxParticipants) {
      return res.status(400).json({ message: "Registration closed. Max participants reached." });
    }

    // ✅ Proceed with registration
    const registration = await Registration.create({
      hackathonId,
      userId,
      formData,
      acceptedTerms: formData.acceptedTerms,
    });

    // ✅ Update Hackathon participants
    hackathon.participants.push(userId);
    await hackathon.save();

    // ✅ Update User's registeredHackathonIds
    await User.findByIdAndUpdate(userId, {
      $addToSet: { registeredHackathonIds: hackathonId },
    });

    res.status(201).json({ success: true, registration });
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
      track: reg.formData.track,
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
      skillDistribution: participants.reduce((acc, p) => {
        const track = p.track || 'Not specified';
        acc[track] = (acc[track] || 0) + 1;
        return acc;
      }, {})
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

    // Remove registration
    await Registration.deleteOne({ hackathonId, userId });

    // Remove from hackathon participants
    await Hackathon.findByIdAndUpdate(hackathonId, { $pull: { participants: userId } });

    // Remove from user's registeredHackathonIds
    await User.findByIdAndUpdate(userId, { $pull: { registeredHackathonIds: hackathonId } });

    res.json({ message: 'You have been unregistered from the hackathon.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unregister from hackathon', details: err.message });
  }
};

module.exports = {
  registerForHackathon,
  getMyRegistrations,
  getHackathonParticipants,
  unregisterFromHackathon,
};
