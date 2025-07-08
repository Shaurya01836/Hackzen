const Badge = require('../model/BadgeModel');
const User = require('../model/UserModel');
const Project = require('../model/ProjectModel');
const Hackathon = require('../model/HackathonModel');
const SubmissionHistory = require('../model/SubmissionHistoryModel'); // Added for judge badges

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


// Check and unlock badges for a user
const checkAndUnlockBadges = async (userId) => {
  console.log(`[Badge] Checking badges for user: ${userId}`);
  try {
    const user = await User.findById(userId)
      .populate('badges.badge')
      .populate('projects')
      .populate('hackathonsJoined')
      .populate('registeredHackathonIds');

    if (!user) {
      console.log(`[Badge] User not found: ${userId}`);
      return [];
    }
    console.log(`[Badge] User: ${user.email}, Role: ${user.role}`);

    const unlockedBadges = [];
    const allBadges = await Badge.find();
    
    // Get user's current badges with proper population
    const userWithBadges = await User.findById(userId).populate('badges.badge');
    const userBadgeIds = userWithBadges.badges.map(b => {
      const badgeId = b.badge?._id?.toString() || b.badge?.toString() || b.toString();
      return badgeId;
    });
    
    console.log(`[Badge] User has ${userBadgeIds.length} current badges:`, userBadgeIds);

    for (const badge of allBadges) {
      const badgeId = badge._id.toString();
      console.log(`[Badge] Checking badge: ${badge.type} (${badgeId}) for role: ${badge.role}`);
      
      // Skip if user already has this badge
      if (userBadgeIds.includes(badgeId)) {
        console.log(`[Badge] Skipping already unlocked badge: ${badge.type} (${badgeId})`);
        continue;
      }

      let shouldUnlock = false;
      console.log(`[Badge] Evaluating criteria for badge: ${badge.type}`);

      // UNIVERSAL BADGES (available to all users)
      if (badge.type === 'member') {
        shouldUnlock = true; // Any authenticated user gets the member badge
        console.log(`[Badge] Member badge will unlock for: ${user.email}`);
      }

      // PARTICIPANT BADGES
      if (badge.role === 'participant') {
        switch (badge.type) {
          case 'first-submission':
            shouldUnlock = user.projects?.length >= 1;
            console.log(`[Badge] First submission check: ${user.projects?.length || 0} projects`);
            break;
          case 'early-bird':
            // Check if user registered for any hackathon within 24 hours of its creation
            const earlyRegistrations = user.hackathonsJoined?.filter(h => {
              const hackathonCreated = new Date(h.createdAt);
              const userRegistered = new Date(h.registrationDate || hackathonCreated);
              const timeDiff = userRegistered.getTime() - hackathonCreated.getTime();
              return timeDiff <= 24 * 60 * 60 * 1000; // 24 hours
            });
            shouldUnlock = earlyRegistrations?.length >= 1;
            console.log(`[Badge] Early bird check: ${earlyRegistrations?.length || 0} early registrations`);
            break;
          case 'first-win':
            shouldUnlock = user.hackathonsJoined?.some(h => h.status === 'ended' && h.winners?.includes(userId));
            console.log(`[Badge] First win check: ${user.hackathonsJoined?.filter(h => h.status === 'ended' && h.winners?.includes(userId)).length} wins`);
            break;
          case 'streak-master':
            shouldUnlock = user.currentStreak >= 7;
            console.log(`[Badge] Streak master check: ${user.currentStreak || 0} day streak`);
            break;
          case 'team-player':
            const uniqueTeams = new Set(user.projects?.map(p => p.team?.toString()).filter(Boolean));
            shouldUnlock = uniqueTeams.size >= 5;
            console.log(`[Badge] Team player check: ${uniqueTeams.size} unique teams`);
            break;
          case 'code-wizard':
            shouldUnlock = user.projects?.length >= 10;
            console.log(`[Badge] Code wizard check: ${user.projects?.length || 0} projects`);
            break;
          case 'hackathon-veteran':
            shouldUnlock = user.registeredHackathonIds?.length >= 10;
            console.log(`[Badge] Hackathon veteran check: ${user.registeredHackathonIds?.length || 0} hackathons`);
            break;
          case 'innovation-leader':
            const winCount = user.hackathonsJoined?.filter(h => h.status === 'ended' && h.winners?.includes(userId)).length;
            shouldUnlock = winCount >= 3;
            console.log(`[Badge] Innovation leader check: ${winCount} wins`);
            break;
          case 'active-participant':
            shouldUnlock = user.registeredHackathonIds?.length >= 3;
            console.log(`[Badge] Active participant check: ${user.registeredHackathonIds?.length || 0} hackathons`);
            break;
        }
      }

      // ORGANIZER BADGES
      if (badge.role === 'organizer') {
        const hackathons = await Hackathon.find({ organizer: user._id });
        const hackathonCount = hackathons.length;
        const totalParticipants = hackathons.reduce((sum, h) => sum + (h.participants?.length || 0), 0);
        const allRatings = hackathons.flatMap(h => h.ratings || []);
        const avgRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length) : 0;
        const has100Plus = hackathons.some(h => (h.participants?.length || 0) >= 100);
        
        console.log(`[Badge] Organizer stats: ${hackathonCount} hackathons, ${totalParticipants} participants, ${avgRating.toFixed(2)} avg rating`);
        
        switch (badge.type) {
          case 'event-creator':
            shouldUnlock = hackathonCount >= 1;
            break;
          case 'community-builder':
            shouldUnlock = has100Plus;
            break;
          case 'innovation-catalyst':
            shouldUnlock = hackathonCount >= 5;
            break;
          case 'excellence-curator':
            shouldUnlock = avgRating >= 4.5;
            break;
          case 'hackathon-legend':
            shouldUnlock = hackathonCount >= 10 && totalParticipants >= 1000;
            break;
        }
      }

      // JUDGE BADGES
      if (badge.role === 'judge') {
        // Get hackathons where user is a judge
        const judgeHackathons = await Hackathon.find({ judges: user._id });
        const judgedSubmissions = await SubmissionHistory.find({ judge: user._id });
        
        console.log(`[Badge] Judge stats: ${judgeHackathons.length} hackathons, ${judgedSubmissions.length} submissions`);
        
        switch (badge.type) {
          case 'fair-evaluator':
            shouldUnlock = judgedSubmissions.length >= 1;
            break;
          case 'insightful-reviewer':
            shouldUnlock = judgedSubmissions.length >= 50;
            break;
          case 'quality-guardian':
            shouldUnlock = judgeHackathons.length >= 5;
            break;
          case 'expert-arbiter':
            shouldUnlock = judgedSubmissions.length >= 100;
            break;
          case 'judgment-master':
            shouldUnlock = judgeHackathons.length >= 10;
            break;
        }
      }

      // MENTOR BADGES
      if (badge.role === 'mentor') {
        // Get projects where user is a mentor
        const mentoredProjects = await Project.find({ mentor: user._id });
        const mentorHackathons = await Hackathon.find({ mentors: user._id });
        
        console.log(`[Badge] Mentor stats: ${mentoredProjects.length} projects, ${mentorHackathons.length} hackathons`);
        
        switch (badge.type) {
          case 'knowledge-sharer':
            shouldUnlock = mentoredProjects.length >= 1;
            break;
          case 'team-guide':
            shouldUnlock = mentoredProjects.length >= 10;
            break;
          case 'skill-developer':
            // Check if user helped 5 teams win hackathons
            const winningTeams = mentoredProjects.filter(p => p.hackathon?.winners?.includes(p.team?.toString()));
            shouldUnlock = winningTeams.length >= 5;
            break;
          case 'innovation-coach':
            shouldUnlock = mentoredProjects.length >= 25;
            break;
          case 'mentorship-legend':
            shouldUnlock = mentoredProjects.length >= 50;
            break;
        }
      }

      if (shouldUnlock) {
        user.badges.push({ badge: badge._id, unlockedAt: new Date() });
        unlockedBadges.push({
          ...badge.toObject(),
          unlockedAt: new Date()
        });
        console.log(`[Badge] ✅ Awarded badge: ${badge.type} to user: ${user.email}`);
      } else {
        console.log(`[Badge] ❌ Skipped badge: ${badge.type} for user: ${user.email} (criteria not met)`);
      }
    }
    
    if (unlockedBadges.length > 0) {
      await user.save();
      console.log(`[Badge] 💾 Saved ${unlockedBadges.length} new badges for user: ${user.email}`);
    } else {
      console.log(`[Badge] ℹ️ No new badges unlocked for user: ${user.email}`);
    }
    
    console.log(`[Badge] ✅ Badge check complete for user: ${user.email}`);
    return unlockedBadges;
  } catch (error) {
    console.error('❌ Error checking badges:', error);
    return [];
  }
};

exports.createBadge = async (req, res) => {
  try {
    const { name, description, iconUrl, criteria, type, rarity, role } = req.body;

    if (!role) {
      return res.status(400).json({ message: 'Role is required for badge creation.' });
    }

    const badge = await Badge.create({ 
      name, 
      description, 
      iconUrl, 
      criteria, 
      type, 
      rarity, 
      role
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

// Manually unlock member badge for testing
exports.unlockMemberBadge = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const memberBadge = await Badge.findOne({ type: 'member' });
    
    if (!user || !memberBadge) {
      return res.status(404).json({ message: 'User or member badge not found' });
    }

    // Check if user already has the member badge
    const hasMemberBadge = user.badges.some(b => {
      const badgeId = b.badge?.toString() || b.toString();
      return badgeId === memberBadge._id.toString();
    });

    if (hasMemberBadge) {
      return res.json({ message: 'User already has member badge', hasBadge: true });
    }

    // Add member badge to user
    user.badges.push({ badge: memberBadge._id, unlockedAt: new Date() });
    await user.save();

    console.log(`[Badge] Manually awarded member badge to user: ${user.email}`);
    
    res.json({ 
      message: 'Member badge unlocked successfully', 
      badge: memberBadge,
      hasBadge: true 
    });
  } catch (err) {
    console.error('Error unlocking member badge:', err);
    res.status(500).json({ message: 'Failed to unlock member badge', error: err.message });
  }
};

// Export checkAndUnlockBadges for testing
module.exports.checkAndUnlockBadges = checkAndUnlockBadges;


