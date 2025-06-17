const mongoose = require('mongoose');
const { MessageSchema } = require('../schema/MessageSchema');

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
module.exports = Message;
