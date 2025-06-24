// middleware/trackStreak.js
const User = require("../model/UserModel");

const trackStreak = async (req, res, next) => {
  const user = req.user;
  if (!user) return next();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastVisit = new Date(user.lastVisit || 0);
  lastVisit.setHours(0, 0, 0, 0);

  if (lastVisit.getTime() !== today.getTime()) {
    // Only add new day if not already logged today
    user.activityLog.push(today);
    user.lastVisit = today;
    await user.save();
  }

  next();
};

module.exports = trackStreak;
