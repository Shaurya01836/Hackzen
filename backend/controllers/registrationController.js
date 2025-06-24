const Registration = require("../model/RegistrationFormModel"); // ✅ This is the registered Mongoose model



const registerForHackathon = async (req, res) => {
  try {
    const { hackathonId, formData } = req.body;
    const userId = req.user._id; // Assuming req.user is set by auth middleware

    // Prevent duplicate registration
    const existing = await Registration.findOne({ hackathonId, userId });
    if (existing) {
      return res.status(400).json({ message: "Already registered." });
    }

    const registration = await Registration.create({
      hackathonId,
      userId,
      formData,
      acceptedTerms: formData.acceptedTerms,
    });

    res.status(201).json({ success: true, registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerForHackathon,
};