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

module.exports = {
  registerForHackathon,
  getMyRegistrations
};
