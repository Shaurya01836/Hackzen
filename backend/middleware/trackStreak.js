const User = require("../model/UserModel");

const trackStreak = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const today = new Date().toISOString().split("T")[0];

    if (!user.activityLog.includes(today)) {
      user.activityLog.push(today);
    }

    user.lastVisit = today;
    await user.save();

    next(); // ✅ Must call next
  } catch (err) {
    console.error("Track streak failed:", err);
    res.status(500).json({ message: "Failed to track streak" });
  }
};

module.exports = trackStreak;
