const Registration = require("../model/HackathonRegistrationModel"); // ✅ This is the registered Mongoose model
const Hackathon = require("../model/HackathonModel");


const registerForHackathon = async (req, res) => {
  try {
    const { hackathonId, formData } = req.body;
    const userId = req.user._id;

    // Check if already registered
    const existing = await Registration.findOne({ hackathonId, userId });
    if (existing) {
      return res.status(400).json({ message: "Already registered." });
    }

    // Fetch the hackathon
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ message: "Hackathon not found." });
    }

    // Check if maxParticipants is reached
    if (hackathon.participants.length >= hackathon.maxParticipants) {
      return res.status(400).json({ message: "Registration closed. Max participants reached." });
    }

    // Proceed with registration
    const registration = await Registration.create({
      hackathonId,
      userId,
      formData,
      acceptedTerms: formData.acceptedTerms,
    });

    // Update Hackathon participants
    hackathon.participants.push(userId.toString());
    await hackathon.save();

    res.status(201).json({ success: true, registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user._id;
    const registrations = await Registration.find({ userId }).select("hackathonId");
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  registerForHackathon,
   getMyRegistrations
};