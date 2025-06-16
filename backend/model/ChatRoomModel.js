const { model } = require('mongoose');

const { ChatRoomSchema } = require('../schema/ChatRoomSchema');

const ChatRoomModel = new model("user", ChatRoomSchema);

module.exports = { ChatRoomModel };