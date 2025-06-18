const Hackathon = require('../model/HackathonModel');
const ChatRoom = require('../model/ChatRoomModel');

// ✅ Create a new hackathon
exports.createHackathon = async (req, res) => {
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
      difficultyLevel: difficulty,
      location,
      organizer: req.user.id,
      prizePool: {
        amount: parseInt(prizePool?.replace(/[^\d]/g, '')) || 0,
        currency: 'USD',
        breakdown: prizePool || ''
      },
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
    const hackathons = await Hackathon.find().populate('organizer', 'name email');
    res.json(hackathons);
  } catch (err) {
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

    const updated = await Hackathon.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        "prizePool.amount": req.body.prizeAmount,
        "prizePool.currency": req.body.prizeCurrency,
        "prizePool.breakdown": req.body.prizeBreakdown
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
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
