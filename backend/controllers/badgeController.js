const Badge = require('../model/BadgeModel');
const User = require('../model/UserModel');

exports.createBadge = async (req, res) => {
  try {
    const { name, description, iconUrl, criteria } = req.body;

    const badge = await Badge.create({ name, description, iconUrl, criteria });
    res.status(201).json(badge);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create badge', error: err.message });
  }
};

exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch badges', error: err.message });
  }
};

exports.getBadgeById = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge) return res.status(404).json({ message: 'Badge not found' });
    res.json(badge);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching badge', error: err.message });
  }
};

exports.deleteBadge = async (req, res) => {
  try {
    const result = await Badge.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Badge not found' });

    res.json({ message: 'Badge deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete badge', error: err.message });
  }
};

exports.assignBadgeToUser = async (req, res) => {
  try {
    const { userId, badgeId } = req.body;

    const user = await User.findById(userId);
    const badge = await Badge.findById(badgeId);
    if (!user || !badge) return res.status(404).json({ message: 'User or badge not found' });

    if (!user.badges.includes(badgeId)) {
      user.badges.push(badgeId);
      await user.save();
    }

    res.json({ message: 'Badge assigned to user', badge });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign badge', error: err.message });
  }
};
