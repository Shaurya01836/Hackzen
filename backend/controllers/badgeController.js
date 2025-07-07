const Badge = require('../model/BadgeModel');
const User = require('../model/UserModel');
const Project = require('../model/ProjectModel');
const Hackathon = require('../model/HackathonModel');

// Predefined achievement badges (10 badges)
const ACHIEVEMENT_BADGES = [
  {
    name: 'First Victory',
    description: 'Win your first hackathon',
    type: 'first-win',
    rarity: 'common',
    criteria: 'Win 1 hackathon',
    iconUrl: '/badges/first-win.svg'
  },
  {
    name: 'Streak Master',
    description: 'Maintain a 7-day activity streak',
    type: 'streak-master',
    rarity: 'uncommon',
    criteria: '7-day streak',
    iconUrl: '/badges/streak.svg'
  },
  {
    name: 'Team Player',
    description: 'Join 5 different teams',
    type: 'team-player',
    rarity: 'rare',
    criteria: 'Join 5 teams',
    iconUrl: '/badges/team.svg'
  },
  {
    name: 'Code Wizard',
    description: 'Submit 10 projects',
    type: 'code-wizard',
    rarity: 'epic',
    criteria: 'Submit 10 projects',
    iconUrl: '/badges/code.svg'
  },
  {
    name: 'Mentor',
    description: 'Help other participants as a mentor',
    type: 'mentor',
    rarity: 'legendary',
    criteria: 'Become a mentor',
    iconUrl: '/badges/mentor.svg'
  },
  {
    name: 'Organizer',
    description: 'Organize a successful hackathon',
    type: 'organizer',
    rarity: 'epic',
    criteria: 'Organize 1 hackathon',
    iconUrl: '/badges/organizer.svg'
  },
  {
    name: 'Hackathon Veteran',
    description: 'Participate in 10 hackathons',
    type: 'hackathon-veteran',
    rarity: 'rare',
    criteria: 'Join 10 hackathons',
    iconUrl: '/badges/veteran.svg'
  },
  {
    name: 'Innovation Leader',
    description: 'Win 3 hackathons',
    type: 'innovation-leader',
    rarity: 'legendary',
    criteria: 'Win 3 hackathons',
    iconUrl: '/badges/innovation.svg'
  },
  {
    name: 'Early Adopter',
    description: 'Join the platform in its early days',
    type: 'early-adopter',
    rarity: 'rare',
    criteria: 'Join within first month',
    iconUrl: '/badges/early.svg'
  },
  {
    name: 'Problem Solver',
    description: 'Submit projects in 5 different categories',
    type: 'problem-solver',
    rarity: 'rare',
    criteria: '5 different categories',
    iconUrl: '/badges/solver.svg'
  }
];

// Initialize achievement badges
const initializeAchievementBadges = async () => {
  try {
    // Clear all existing badges first
    await Badge.deleteMany({});
    console.log('✅ Cleared existing badges');
    
    // Insert only the 10 achievement badges
    await Badge.insertMany(ACHIEVEMENT_BADGES);
    console.log(`✅ Initialized ${ACHIEVEMENT_BADGES.length} achievement badges`);
  } catch (error) {
    console.error('Error initializing achievement badges:', error);
  }
};

// Check and unlock badges for a user
const checkAndUnlockBadges = async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate('badges')
      .populate('projects')
      .populate('hackathonsJoined');

    if (!user) return [];

    const unlockedBadges = [];
    const allBadges = await Badge.find();

    for (const badge of allBadges) {
      // Skip if user already has this badge
      if (user.badges.some(userBadge => userBadge._id.toString() === badge._id.toString())) {
        continue;
      }

      let shouldUnlock = false;

      switch (badge.type) {
        case 'first-win':
          // Check if user has won any hackathons
          const wonHackathons = user.hackathonsJoined.filter(h => h.status === 'ended' && h.winners?.includes(userId));
          shouldUnlock = wonHackathons.length >= 1;
          break;

        case 'streak-master':
          // Check if user has 7-day streak (this would need streak tracking)
          shouldUnlock = user.currentStreak >= 7;
          break;

        case 'team-player':
          // Check if user has been in 5 different teams
          const uniqueTeams = new Set(user.projects.map(p => p.team?.toString()).filter(Boolean));
          shouldUnlock = uniqueTeams.size >= 5;
          break;

        case 'code-wizard':
          // Check if user has submitted 10 projects
          shouldUnlock = user.projects.length >= 10;
          break;

        case 'mentor':
          // Check if user is a mentor
          shouldUnlock = user.role === 'mentor';
          break;

        case 'organizer':
          // Check if user has organized hackathons
          const organizedHackathons = await Hackathon.find({ organizer: userId });
          shouldUnlock = organizedHackathons.length >= 1;
          break;

        case 'hackathon-veteran':
          // Check if user has participated in 10 hackathons
          shouldUnlock = user.hackathonsJoined.length >= 10;
          break;

        case 'innovation-leader':
          // Check if user has won 3 hackathons
          const wonHackathonsCount = user.hackathonsJoined.filter(h => 
            h.status === 'ended' && h.winners?.includes(userId)
          ).length;
          shouldUnlock = wonHackathonsCount >= 3;
          break;

        case 'early-adopter':
          // Check if user joined within first month of platform launch
          const platformLaunch = new Date('2024-01-01'); // Adjust as needed
          const userJoinDate = user.createdAt;
          shouldUnlock = userJoinDate.getTime() - platformLaunch.getTime() <= 30 * 24 * 60 * 60 * 1000;
          break;

        case 'problem-solver':
          // Check if user has submitted projects in 5 different categories
          const categories = new Set(user.projects.map(p => p.category).filter(Boolean));
          shouldUnlock = categories.size >= 5;
          break;
      }

      if (shouldUnlock) {
        user.badges.push(badge._id);
        unlockedBadges.push({
          ...badge.toObject(),
          unlockedAt: new Date()
        });
      }
    }

    if (unlockedBadges.length > 0) {
      await user.save();
    }

    return unlockedBadges;
  } catch (error) {
    console.error('Error checking badges:', error);
    return [];
  }
};

exports.createBadge = async (req, res) => {
  try {
    const { name, description, iconUrl, criteria, type, rarity } = req.body;

    const badge = await Badge.create({ 
      name, 
      description, 
      iconUrl, 
      criteria, 
      type, 
      rarity 
    });
    res.status(201).json(badge);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create badge', error: err.message });
  }
};

exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find().sort({ rarity: -1, name: 1 });
    res.json(badges);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch badges', error: err.message });
  }
};

exports.getBadgeById = async (req, res) => {
  try {
    const badge = await Badge.findById(req.params.id);
    if (!badge) return res.status(404).json({ message: 'Badge not found' });
    res.json(badge);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching badge', error: err.message });
  }
};

exports.deleteBadge = async (req, res) => {
  try {
    const result = await Badge.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Badge not found' });

    res.json({ message: 'Badge deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete badge', error: err.message });
  }
};

exports.assignBadgeToUser = async (req, res) => {
  try {
    const { userId, badgeId } = req.body;

    const user = await User.findById(userId);
    const badge = await Badge.findById(badgeId);
    if (!user || !badge) return res.status(404).json({ message: 'User or badge not found' });

    if (!user.badges.includes(badgeId)) {
      user.badges.push(badgeId);
      await user.save();
    }

    res.json({ message: 'Badge assigned to user', badge });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign badge', error: err.message });
  }
};

// Get user's badges with unlock status
exports.getUserBadges = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('badges');
    const allBadges = await Badge.find();

    if (!user) return res.status(404).json({ message: 'User not found' });

    const userBadgeIds = user.badges.map(badge => badge._id.toString());
    
    const badgesWithStatus = allBadges.map(badge => ({
      ...badge.toObject(),
      isUnlocked: userBadgeIds.includes(badge._id.toString()),
      unlockedAt: userBadgeIds.includes(badge._id.toString()) ? 
        user.badges.find(b => b._id.toString() === badge._id.toString())?.unlockedAt || new Date() : null
    }));

    res.json(badgesWithStatus);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user badges', error: err.message });
  }
};

// Check and unlock badges for current user
exports.checkUserBadges = async (req, res) => {
  try {
    const userId = req.user._id;
    const unlockedBadges = await checkAndUnlockBadges(userId);
    
    res.json({ 
      message: 'Badge check completed', 
      unlockedBadges,
      count: unlockedBadges.length 
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to check badges', error: err.message });
  }
};

// Get user's achievement progress
exports.getUserProgress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId)
      .populate('badges')
      .populate('projects')
      .populate('hackathonsJoined');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const allBadges = await Badge.find();
    const unlockedCount = user.badges.length;
    const totalCount = allBadges.length;
    const progressPercentage = (unlockedCount / totalCount) * 100;

    // Calculate rarity breakdown
    const rarityStats = {};
    user.badges.forEach(badge => {
      rarityStats[badge.rarity] = (rarityStats[badge.rarity] || 0) + 1;
    });

    res.json({
      unlockedCount,
      totalCount,
      progressPercentage,
      rarityStats,
      badges: user.badges
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user progress', error: err.message });
  }
};

// Initialize badges on module load
initializeAchievementBadges();
