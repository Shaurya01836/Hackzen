const Hackathon = require('../model/HackathonModel');
const ChatRoom = require('../model/ChatRoomModel');
const User = require('../model/UserModel');

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
      difficultyLevel,
      location,
      prizePool,
      problemStatements,
      problemStatementTypes,
      requirements,
      perks,
      tags,
      images,
      mode,
      rounds,
      judges, 
      mentors, 
      participants
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
      difficultyLevel: difficultyLevel || 'Beginner',
      location,
      organizer: req.user.id,
      prizePool: {
        amount: prizePool?.amount || 0,
        currency: prizePool?.currency || 'USD',
        breakdown: prizePool?.breakdown || ''
      },
      images,
      mode,
      problemStatements,
      problemStatementTypes,
      requirements,
      perks,
      tags,
      rounds,
      judges,
      mentors,
      participants,
      approvalStatus: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    await ChatRoom.create({
      hackathon: newHackathon._id,
      type: 'general'
    });

    res.status(201).json(newHackathon);
  } catch (err) {
    console.error("❌ Error in createHackathon:", err);
    res.status(500).json({ message: 'Server error creating hackathon' });
  }
};


//get my hackathon (organizer ke liye)
exports.getMyHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ organizer: req.user._id })
      .populate('organizer', 'name email')
      .populate('participants', '_id');

    res.json(hackathons);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your hackathons' });
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
      difficultyLevel,
      location,
      prizePool,
      images,
      mode,
      problemStatements,
      problemStatementTypes,
      requirements,
      perks,
      tags,
      rounds,
      judges,
      mentors,
      participants
    } = req.body;


    console.log("Judges from request:", judges);
    console.log("Mentors from request:", mentors);

    // Saari fields ko bina condition ke ek object mein daalo
    const updateFields = {
      title,
      description,
      startDate,
      endDate,
      registrationDeadline,
      submissionDeadline,
      maxParticipants,
      status,
      category,
      difficultyLevel,
      location,
      mode,
      problemStatements,
      problemStatementTypes,
      requirements,
      perks,
      tags,
      rounds,
      images,
      judges,
      mentors,
      participants,
      prizePool: {
        amount: prizePool?.amount || 0,
        currency: prizePool?.currency || 'USD',
        breakdown: prizePool?.breakdown || ''
      }
    };
    

    // Jo fields undefined hai unko hata do taaki wo update na kare
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === undefined) {
        delete updateFields[key];
      }
    });

    const updated = await Hackathon.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Error updating hackathon:", err);
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

exports.getAllHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find().lean();

    const enriched = hackathons.map((hackathon) => ({
      ...hackathon,
      participantsCount: hackathon.participants?.length || 0,
    }));

    res.status(200).json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};