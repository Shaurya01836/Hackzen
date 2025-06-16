const mongoose = require('mongoose');
const userSchema = require('../schema/User.schema');

module.exports = mongoose.model('User', userSchema);
