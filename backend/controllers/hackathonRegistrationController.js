const Registration = require("../model/HackathonRegistrationModel"); // ✅ This is the registered Mongoose model
const Hackathon = require("../model/HackathonModel");


const registerForHackathon = async (req, res) => {
  try {
    const { hackathonId, formData } = req.body;
    const userId = req.user._id;

    // Prevent duplicate registration
    const existing = await Registration.findOne({ hackathonId, userId });
    if (existing) {
      return res.status(400).json({ message: "Already registered." });
    }

    // 1. Save the registration entry
    const registration = await Registration.create({
      hackathonId,
      userId,
      formData,
      acceptedTerms: formData.acceptedTerms,
    });

    // 2. Push userId to Hackathon.participants[]
    await Hackathon.findByIdAndUpdate(
      hackathonId,
      { $addToSet: { participants: userId.toString() } }, // avoids duplicates
      { new: true }
    );

    res.status(201).json({ success: true, registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerForHackathon,
};