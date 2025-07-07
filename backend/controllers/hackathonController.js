const Hackathon = require('../model/HackathonModel');
const Notification = require('../model/NotificationModel');
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
      participants,
      teamSize
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
      teamSize: teamSize || { min: 1, max: 4, allowSolo: true },
      approvalStatus: 'pending' // Always set to pending for now, admin can approve later
    });



    await ChatRoom.create({
      hackathon: newHackathon._id,
      type: 'general'
    });

    // Send notification to organizer about pending approval
    await Notification.create({
      recipient: req.user.id,
      message: `📋 Your hackathon "${newHackathon.title}" has been submitted for admin approval. You'll be notified once it's reviewed.`,
      type: 'info',
      hackathon: newHackathon._id
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
    
    // Check if user is admin or the organizer
    const isAdmin = req.user?.role === 'admin';
    const isOrganizer = req.user?.id === hackathon.organizer?._id?.toString();
    
    // Only allow access if hackathon is approved, or user is admin/organizer
    if (!isAdmin && !isOrganizer && hackathon.approvalStatus !== 'approved') {
      return res.status(404).json({ message: 'Hackathon not found' });
    }
    
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
      participants,
      teamSize
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
      teamSize,
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
    res.json({ message: 'Hackathon deleted successfully' });
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
    ).populate('organizer', 'name email');

    if (!updated) return res.status(404).json({ message: 'Hackathon not found' });

    // Send notification to organizer
    const notificationMessage = status === 'approved' 
      ? `🎉 Your hackathon "${updated.title}" has been approved! It's now visible in the explore section.`
      : `❌ Your hackathon "${updated.title}" has been rejected. Please review and resubmit.`;

    await Notification.create({
      recipient: updated.organizer._id,
      message: notificationMessage,
      type: status === 'approved' ? 'success' : 'warning',
      hackathon: updated._id
    });

    res.json(updated);
  } catch (err) {
    console.error("Error updating approval status:", err);
    res.status(500).json({ message: 'Error updating approval status' });
  }
};

exports.getAllHackathons = async (req, res) => {
  try {
    // Only show approved hackathons to participants
    const hackathons = await Hackathon.find({ 
      approvalStatus: 'approved' 
    })
    .populate('organizer', 'name email')
    .populate('participants', '_id')
    .lean();

    const enriched = hackathons.map((hackathon) => ({
      ...hackathon,
      participantsCount: hackathon.participants?.length || 0,
    }));

    res.status(200).json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin Dashboard Hackathon Statistics
exports.getHackathonStats = async (req, res) => {
  try {
    // Get total hackathons count
    const totalHackathons = await Hackathon.countDocuments();
    
    // Get active hackathons (registration open)
    const now = new Date();
    const activeHackathons = await Hackathon.countDocuments({
      registrationDeadline: { $gte: now },
      approvalStatus: 'approved'
    });

    // Get approved hackathons
    const approvedHackathons = await Hackathon.countDocuments({
      approvalStatus: 'approved'
    });

    // Get pending hackathons
    const pendingHackathons = await Hackathon.countDocuments({
      approvalStatus: 'pending'
    });

    // Get total participants across all hackathons
    const totalParticipants = await Hackathon.aggregate([
      {
        $group: {
          _id: null,
          totalParticipants: { $sum: { $size: '$participants' } }
        }
      }
    ]);

    // Get hackathons created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const hackathonsThisMonth = await Hackathon.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Calculate percentage change from last month
    const startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);
    const endOfLastMonth = new Date();
    endOfLastMonth.setDate(1);
    endOfLastMonth.setHours(0, 0, 0, 0);
    const hackathonsLastMonth = await Hackathon.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth }
    });

    const hackathonGrowthPercentage = hackathonsLastMonth > 0 
      ? ((hackathonsThisMonth - hackathonsLastMonth) / hackathonsLastMonth * 100).toFixed(1)
      : hackathonsThisMonth > 0 ? 100 : 0;

    res.json({
      totalHackathons,
      activeHackathons,
      approvedHackathons,
      pendingHackathons,
      totalParticipants: totalParticipants[0]?.totalParticipants || 0,
      hackathonsThisMonth,
      hackathonGrowthPercentage: hackathonGrowthPercentage > 0 ? `+${hackathonGrowthPercentage}%` : `${hackathonGrowthPercentage}%`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get monthly hackathon creation data for charts
exports.getMonthlyHackathonStats = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Hackathon.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = monthlyStats.map(stat => ({
      month: monthNames[stat._id.month - 1],
      hackathons: stat.count
    }));

    res.json(chartData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get hackathon status breakdown for pie chart
exports.getHackathonStatusBreakdown = async (req, res) => {
  try {
    const statusBreakdown = await Hackathon.aggregate([
      {
        $group: {
          _id: '$approvalStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusColors = {
      approved: '#10B981',
      pending: '#F59E0B',
      rejected: '#EF4444'
    };

    const pieData = statusBreakdown.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
      color: statusColors[item._id] || '#6B7280'
    }));

    res.json(pieData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};