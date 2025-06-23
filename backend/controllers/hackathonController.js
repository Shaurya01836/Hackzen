const Hackathon = require('../model/HackathonModel');
const ChatRoom = require('../model/ChatRoomModel');

// ✅ Create a new hackathon
exports.createHackathon = async (req, res) => {
  console.log("📥 Incoming Hackathon Create Request:");
  console.log("👉 req.body:", req.body);
  console.log("🔐 req.user:", req.user);
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      registrationDeadline,
      submissionDeadline,
      maxParticipants,
      status,
      category,
      difficulty,
      location,
      prizePool,
      problemStatements,
      requirements,
      perks,
      tags
    } = req.body;

    const newHackathon = await Hackathon.create({
      title,
      description,
      startDate,
      endDate,
      registrationDeadline,
      submissionDeadline,
      maxParticipants,
      status,
      category,
      difficultyLevel: difficulty || 'Beginner',
      location,
      organizer: req.user.id,
        prizePool: {
    amount: req.body.prizePool.amount,
    currency: req.body.prizePool.currency,
    breakdown: req.body.prizePool.breakdown
  },
    images: req.body.images,
      problemStatements,
      requirements,
      perks,
      tags
    });

    // Optional: Create a general chat room
    await ChatRoom.create({
      hackathon: newHackathon._id,
      type: 'general'
    });

    res.status(201).json(newHackathon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating hackathon' });
  }
};


// ✅ Get all hackathons
exports.getAllHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find()
      .populate('organizer', 'name email')
      .populate('participants', '_id'); // keep this to populate array

    const formattedHackathons = hackathons.map(h => {
      const hObj = h.toObject();
      return {
        ...hObj,
        participantCount: Array.isArray(hObj.participants) ? hObj.participants.length : 0,
        // 👇 DO NOT remove the participants field!
        // participants: undefined  <-- REMOVE THIS LINE if present!
      };
    });

    console.log("Sending hackathons to frontend:", formattedHackathons.length);
    res.json(formattedHackathons);
  } catch (err) {
    console.error("Error in getAllHackathons:", err);
    res.status(500).json({ message: 'Error fetching hackathons' });
  }
};


// ✅ Get a single hackathon by ID
exports.getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
      .populate('organizer', 'name');
    
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    res.json(hackathon);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving hackathon' });
  }
};

// ✅ Update a hackathon (only organizer allowed)
exports.updateHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this hackathon' });
    }

    const updateFields = {
      ...req.body,
      prizePool: {
        amount: req.body.prizePool?.amount || 0,
        currency: req.body.prizePool?.currency || 'USD',
        breakdown: req.body.prizePool?.breakdown || '',
      },
      images: req.body.images || hackathon.images // fallback to existing images if not updated
    };

    const updated = await Hackathon.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Error in updateHackathon:", err);
    res.status(500).json({ message: 'Error updating hackathon' });
  }
};
// ✅ Delete a hackathon (only organizer allowed)
exports.deleteHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this hackathon' });
    }

    await Hackathon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hackathon deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting hackathon' });
  }
};
