const User = require("../model/UserModel");

const trackStreak = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return next(); // skip if not logged in

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastVisit = new Date(user.lastVisit || 0);
    lastVisit.setHours(0, 0, 0, 0);

    if (lastVisit.getTime() !== today.getTime()) {
      // Only update if it's a new day
      user.activityLog.push(today);
      user.lastVisit = today;
      await user.save();
    }

    next();
  } catch (err) {
    console.error("Error in trackStreak middleware:", err);
    return res.status(500).json({ message: "Streak tracking failed" });
  }
};

module.exports = trackStreak;
