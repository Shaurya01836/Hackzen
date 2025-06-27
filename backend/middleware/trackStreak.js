const User = require("../model/UserModel");

const trackStreak = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { activityLog: today },
        $set: { lastVisit: today }
      }
    );

    next(); // ✅ continue to next middleware/route
  } catch (err) {
    console.error("Track streak failed:", err);
    res.status(500).json({ message: "Failed to track streak" });
  }
};

module.exports = trackStreak;
