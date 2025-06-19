const Announcement = require('../model/AnnouncementModel');
const Notification = require('../model/NotificationModel');

exports.sendAnnouncement = async (req, res) => {
  try {
    const { title, message, hackathonId, audience } = req.body;
    const postedBy = req.user.id;

    // Prepare announcement data
    const announcementData = {
      title,
      message,
      audience,
      postedBy,
    };

    // Only include hackathon if provided (for global announcements)
    if (hackathonId) {
      announcementData.hackathon = hackathonId;
    }

    // Create announcement
    const newAnn = await Announcement.create(announcementData);

    // Create a general notification (expand logic later for user targeting)
    await Notification.create({
      user: null, // Future: can target by role or hackathon membership
      hackathon: hackathonId || null,
      message: `📢 New announcement: ${title}`,
      type: 'announcement'
    });

    res.status(201).json({ success: true, announcement: newAnn });
  } catch (err) {
    console.error('❌ Error sending announcement:', err);
    res.status(500).json({ message: "Failed to send announcement" });
  }
};
exports.getAnnouncements = async (req, res) => {
  try {
    const userRole = req.user.role;
    
    // Fetch announcements visible to all or targeted to the user's role
    const announcements = await Announcement.find({
      $or: [
        { audience: 'all' },
        { audience: userRole } // roles: 'participants', 'mentors', etc.
      ]
    })
    .sort({ createdAt: -1 })
    .populate('postedBy', 'name email') // optional
    .populate('hackathon', 'title'); // optional

    res.json({ success: true, announcements });
  } catch (err) {
    console.error("Error fetching announcements:", err);
    res.status(500).json({ message: 'Failed to fetch announcements' });
  }
};
