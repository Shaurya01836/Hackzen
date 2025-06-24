const mongoose = require('mongoose');
const { UserSchema } = require('../schema/UserSchema');

const User = mongoose.models.User || mongoose.model('User', UserSchema);
module.exports = User;