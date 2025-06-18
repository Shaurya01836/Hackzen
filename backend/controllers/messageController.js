// controllers/messageController.js
const Message = require('../model/MessageModel');
const ChatRoom = require('../model/ChatRoomModel');

// Get all messages in a room
exports.getMessagesByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ chatRoom: roomId })
      .populate('sender', 'name role profileImage') // Optional, for displaying in UI
      .sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

// Post a new message
exports.sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { roomId } = req.params;

    if (!content || !roomId) {
      return res.status(400).json({ message: 'Content and room ID are required' });
    }

    const message = await Message.create({
      chatRoom: roomId,
      sender: req.user._id,
      content
    });

    const populatedMessage = await message.populate('sender', 'name role profileImage');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
};
