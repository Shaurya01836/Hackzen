const Registration = require("../schema/RegistrationFormSchema"); // ✅ direct import


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

// in registrationController.js
const getMyRegistration = async (req, res) => {
  try {
    const userId = req.user._id;
    const registration = await Registration.find({ userId }).select("hackathonId");

    const registeredHackathonIds = registration.map((r) =>
      r.hackathonId.toString()
    );

    res.status(200).json({ registeredHackathonIds });
  } catch (err) {
    res.status(500).json({ message: "Error fetching registration" });
  }
};


module.exports = {
  registerForHackathon,
  getMyRegistration,
};
