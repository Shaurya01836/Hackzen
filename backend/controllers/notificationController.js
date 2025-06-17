const Notification = require('../model/NotificationModel');

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
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications', details: err.message });
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

exports.deleteNotification = async (req, res) => {
  try {
    const result = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });

    if (!result) return res.status(404).json({ message: 'Notification not found' });

    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notification', details: err.message });
  }
};
