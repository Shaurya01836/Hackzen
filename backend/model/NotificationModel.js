const { model } = require('mongoose');

const { NotificationSchema } = require('../schema/NotificationSchema');

const NotificationModel = new model("user", NotificationSchema);

module.exports = { NotificationModel };