const mongoose = require('mongoose');
const HackathonRegistrationSchema = require('../schema/HackathonRegistrationSchema'); // ❌ no destructuring here

const HackathonRegistration = mongoose.models.HackathonRegistration || mongoose.model('HackathonRegistration', HackathonRegistrationSchema);

module.exports = HackathonRegistration;
