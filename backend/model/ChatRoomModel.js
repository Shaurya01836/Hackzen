const mongoose = require('mongoose');
const { ChatRoomSchema } = require('../schema/ChatRoomSchema');

const ChatRoom = mongoose.models.ChatRoom || mongoose.model('ChatRoom', ChatRoomSchema);
module.exports = ChatRoom;
