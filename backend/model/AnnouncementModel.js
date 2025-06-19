const mongoose = require('mongoose');
const { AnnouncementSchema } = require('../schema/AnnouncementSchema');

// Fix: register the schema properly with mongoose.model
const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);

module.exports = Announcement;
