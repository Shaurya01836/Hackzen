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
      tags,
      images
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
        amount: prizePool?.amount || 0,
        currency: prizePool?.currency || 'USD',
        breakdown: prizePool?.breakdown || ''
      },
      images,
      problemStatements,
      requirements,
      perks,
      tags,
      approvalStatus: req.user.role === 'admin' ? 'approved' : 'pending'
    });

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

// ✅ Get all hackathons (only approved ones)
exports.getAllHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ approvalStatus: 'approved' })
      .populate('organizer', 'name email')
      .populate('participants', '_id');

    const formatted = hackathons.map(h => ({
      ...h.toObject(),
      participantCount: h.participants?.length || 0
    }));

    res.json(formatted);
  } catch (err) {
    console.error("getAllHackathons error:", err);
    res.status(500).json({ message: 'Error fetching hackathons' });
  }
};

// ✅ Admin or Organizer: Get all hackathons (including pending)
exports.getAllHackathonsRaw = async (req, res) => {
  try {
    const hackathons = await Hackathon.find()
      .populate('organizer', 'name email')
      .populate('participants', '_id');

    res.json(hackathons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all hackathons' });
  }
};

// ✅ Get single hackathon by ID
exports.getHackathonById = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id)
      .populate('organizer', 'name');

    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });
    res.json(hackathon);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving hackathon' });
  }
};

// ✅ Update hackathon (only creator)
exports.updateHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });

    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this hackathon' });
    }

    const updated = await Hackathon.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        prizePool: {
          amount: req.body.prizePool?.amount || 0,
          currency: req.body.prizePool?.currency || 'USD',
          breakdown: req.body.prizePool?.breakdown || ''
        },
        images: req.body.images || hackathon.images
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating hackathon' });
  }
};

// ✅ Delete hackathon (only creator)
exports.deleteHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });

    if (hackathon.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this hackathon' });
    }

    await Hackathon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hackathon deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting hackathon' });
  }
};

// ✅ Admin: Approve or Reject hackathon
exports.updateApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await Hackathon.findByIdAndUpdate(
      id,
      { approvalStatus: status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Hackathon not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating approval status' });
  }
};
