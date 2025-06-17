const mongoose = require('mongoose');
const { AnnouncementSchema } = require('../schema/AnnouncementSchema');

const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
module.exports = Announcement;
