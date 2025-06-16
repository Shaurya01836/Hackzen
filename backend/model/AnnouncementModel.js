const { model } = require('mongoose');

const { AnnouncementSchema } = require('../schema/AnnouncementSchema');

const AnnouncementModel = new model("user", AnnouncementSchema);

module.exports = { AnnouncementModel };