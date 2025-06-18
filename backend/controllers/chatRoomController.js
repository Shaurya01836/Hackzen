// controllers/chatRoomController.js
const ChatRoom = require('../model/ChatRoomModel');

// Create a new chat room (admin or system)
exports.createChatRoom = async (req, res) => {
  try {
    const { hackathon, team, type } = req.body;

    if (!hackathon || !type) {
      return res.status(400).json({ message: 'Hackathon and type are required' });
    }

    // Check for duplicates
    const exists = await ChatRoom.findOne({ hackathon, team, type });
    if (exists) return res.status(400).json({ message: 'Chat room already exists' });

    const chatRoom = await ChatRoom.create({ hackathon, team, type });

    res.status(201).json(chatRoom);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create chat room' });
  }
};

// Get all rooms for a hackathon
exports.getHackathonRooms = async (req, res) => {
  try {
    const { hackathonId } = req.params;

    const rooms = await ChatRoom.find({ hackathon: hackathonId })
      .populate('team', 'name') // optional: populate team info
      .sort({ createdAt: -1 });

    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
};

// Get the general room for a hackathon
exports.getGeneralRoom = async (req, res) => {
  try {
    const { hackathonId } = req.params;

    const room = await ChatRoom.findOne({
      hackathon: hackathonId,
      type: 'general'
    });

    if (!room) return res.status(404).json({ message: 'General room not found' });

    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch general room' });
  }
};
