const mongoose = require('mongoose');
const { NotificationSchema } = require('../schema/NotificationSchema');

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
