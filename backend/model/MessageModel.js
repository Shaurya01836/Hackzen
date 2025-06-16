const { model } = require('mongoose');

const { MessageSchema } = require('../schema/MessageSchema');

const MessageModel = new model("user", MessageSchema);

module.exports = { MessageModel };