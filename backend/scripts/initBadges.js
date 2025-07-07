const mongoose = require('mongoose');
const Badge = require('../model/BadgeModel');
const User = require('../model/UserModel');

// Achievement badges data (10 badges)
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

const initializeBadges = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Clear ALL existing badges
    const deleteResult = await Badge.deleteMany({});
    console.log(`✅ Cleared ${deleteResult.deletedCount} existing badges`);

    // Insert new 10 badges
    const badges = await Badge.insertMany(ACHIEVEMENT_BADGES);
    console.log(`✅ Inserted ${badges.length} new badges`);

    // Clear user badges that reference old badges
    const users = await User.find({});
    console.log(`Found ${users.length} users to update`);

    for (const user of users) {
      // Clear all existing badges
      user.badges = [];
      await user.save();
      console.log(`✅ Cleared badges for user ${user.name || user.email}`);
    }

    console.log('🎉 Badge initialization complete!');
    console.log('📊 Summary:');
    console.log(`   - Deleted ${deleteResult.deletedCount} old badges`);
    console.log(`   - Inserted ${badges.length} new badges`);
    console.log(`   - Updated ${users.length} users`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing badges:', error);
    process.exit(1);
  }
};

// Run the initialization
initializeBadges(); 