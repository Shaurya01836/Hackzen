const Notification = require('../model/NotificationModel');
const Announcement = require("../model/AnnouncementModel");
exports.createNotification = async (req, res) => {
  try {
    const { recipient, message, type } = req.body;

    const notification = await Notification.create({
      recipient,
      message,
      type,
    });

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notification', details: err.message });
  }
};

exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // 1. Get user-specific notifications
    const personal = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate('sender', 'name email role')
      .lean();

    // 2. Get relevant announcements as notifications
    const announcements = await Announcement.find({
      $or: [
        { audience: "all" },
        { audience: userRole } // like 'participants', 'organizers'
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    const announcementNotifs = announcements.map(a => ({
      _id: a._id,
      message: `📢 ${a.title} - ${a.message}`,
      type: "announcement",
      read: false,
      createdAt: a.createdAt,
      fromAnnouncement: true // helps frontend distinguish
    }));

    // 3. Combine and sort by date
    const allNotifs = [...personal, ...announcementNotifs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(allNotifs);
  } catch (err) {
    console.error("❌ Notification fetch failed:", err);
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification', details: err.message });
  }
};

exports.markAsUnread = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: false },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification', details: err.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark all as read', details: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const result = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });

    if (!result) return res.status(404).json({ message: 'Notification not found' });

    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notification', details: err.message });
  }
};
