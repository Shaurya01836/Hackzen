  require('dotenv').config();
  const mongoose = require('mongoose');
const Badge = require('../model/BadgeModel');
const User = require('../model/UserModel');

// Participant badges (10 badges)
const PARTICIPANT_BADGES = [
  { name: 'Member of HackZen', description: 'Welcome to HackZen! You joined the platform.', type: 'member', rarity: 'common', criteria: 'Join HackZen', iconUrl: '/badges/member.svg', role: 'participant' },
  { name: 'First Submission', description: 'Submit your first project.', type: 'first-submission', rarity: 'common', criteria: 'Submit 1 project', iconUrl: '/badges/first-submission.svg', role: 'participant' },
  { name: 'Early Bird', description: 'Register for a hackathon within 24 hours of its announcement.', type: 'early-bird', rarity: 'uncommon', criteria: 'Register within 24h', iconUrl: '/badges/early-bird.svg', role: 'participant' },
  { name: 'First Victory', description: 'Win your first hackathon', type: 'first-win', rarity: 'common', criteria: 'Win 1 hackathon', iconUrl: '/badges/first-win.svg', role: 'participant' },
  { name: 'Streak Master', description: 'Maintain a 7-day activity streak', type: 'streak-master', rarity: 'uncommon', criteria: '7-day streak', iconUrl: '/badges/streak.svg', role: 'participant' },
  { name: 'Team Player', description: 'Join 5 different teams', type: 'team-player', rarity: 'rare', criteria: 'Join 5 teams', iconUrl: '/badges/team.svg', role: 'participant' },
  { name: 'Code Wizard', description: 'Submit 10 projects', type: 'code-wizard', rarity: 'epic', criteria: 'Submit 10 projects', iconUrl: '/badges/code.svg', role: 'participant' },
  { name: 'Hackathon Veteran', description: 'Participate in 10 hackathons', type: 'hackathon-veteran', rarity: 'rare', criteria: 'Join 10 hackathons', iconUrl: '/badges/veteran.svg', role: 'participant' },
  { name: 'Innovation Leader', description: 'Win 3 hackathons', type: 'innovation-leader', rarity: 'legendary', criteria: 'Win 3 hackathons', iconUrl: '/badges/innovation.svg', role: 'participant' },
  { name: 'Active Participant', description: 'Participate in 3 hackathons', type: 'active-participant', rarity: 'common', criteria: 'Join 3 hackathons', iconUrl: '/badges/active.svg', role: 'participant' }
];

// Organizer badges (5 badges)
const ORGANIZER_BADGES = [
  { name: 'Event Creator', description: 'Create your first hackathon', type: 'event-creator', rarity: 'common', criteria: 'Create 1 hackathon', iconUrl: '/badges/event-creator.svg', role: 'organizer' },
  { name: 'Community Builder', description: 'Organize a hackathon with 100+ participants', type: 'community-builder', rarity: 'uncommon', criteria: '100+ participants', iconUrl: '/badges/community-builder.svg', role: 'organizer' },
  { name: 'Innovation Catalyst', description: 'Organize 5 successful hackathons', type: 'innovation-catalyst', rarity: 'rare', criteria: 'Organize 5 hackathons', iconUrl: '/badges/innovation-catalyst.svg', role: 'organizer' },
  { name: 'Excellence Curator', description: 'Receive 4.5+ average rating on your hackathons', type: 'excellence-curator', rarity: 'epic', criteria: '4.5+ average rating', iconUrl: '/badges/excellence-curator.svg', role: 'organizer' },
  { name: 'Hackathon Legend', description: 'Organize 10+ hackathons with 1000+ total participants', type: 'hackathon-legend', rarity: 'legendary', criteria: '10+ hackathons, 1000+ participants', iconUrl: '/badges/hackathon-legend.svg', role: 'organizer' }
];

// Judge badges (5 badges)
const JUDGE_BADGES = [
  { name: 'Fair Evaluator', description: 'Judge your first hackathon', type: 'fair-evaluator', rarity: 'common', criteria: 'Judge 1 hackathon', iconUrl: '/badges/fair-evaluator.svg', role: 'judge' },
  { name: 'Insightful Reviewer', description: 'Review 50+ submissions', type: 'insightful-reviewer', rarity: 'uncommon', criteria: 'Review 50 submissions', iconUrl: '/badges/insightful-reviewer.svg', role: 'judge' },
  { name: 'Quality Guardian', description: 'Judge 5 different hackathons', type: 'quality-guardian', rarity: 'rare', criteria: 'Judge 5 hackathons', iconUrl: '/badges/quality-guardian.svg', role: 'judge' },
  { name: 'Expert Arbiter', description: 'Provide 100+ detailed evaluations', type: 'expert-arbiter', rarity: 'epic', criteria: '100+ evaluations', iconUrl: '/badges/expert-arbiter.svg', role: 'judge' },
  { name: 'Judgment Master', description: 'Judge 10+ hackathons with 95%+ participant satisfaction', type: 'judgment-master', rarity: 'legendary', criteria: '10+ hackathons, 95%+ satisfaction', iconUrl: '/badges/judgment-master.svg', role: 'judge' }
];

// Mentor badges (5 badges)
const MENTOR_BADGES = [
  { name: 'Knowledge Sharer', description: 'Become a mentor for the first time', type: 'knowledge-sharer', rarity: 'common', criteria: 'Become a mentor', iconUrl: '/badges/knowledge-sharer.svg', role: 'mentor' },
  { name: 'Team Guide', description: 'Mentor 10+ teams', type: 'team-guide', rarity: 'uncommon', criteria: 'Mentor 10 teams', iconUrl: '/badges/team-guide.svg', role: 'mentor' },
  { name: 'Skill Developer', description: 'Help 5 teams win hackathons', type: 'skill-developer', rarity: 'rare', criteria: 'Help 5 winning teams', iconUrl: '/badges/skill-developer.svg', role: 'mentor' },
  { name: 'Innovation Coach', description: 'Mentor 25+ teams across different hackathons', type: 'innovation-coach', rarity: 'epic', criteria: 'Mentor 25+ teams', iconUrl: '/badges/innovation-coach.svg', role: 'mentor' },
  { name: 'Mentorship Legend', description: 'Mentor 50+ teams with 90%+ success rate', type: 'mentorship-legend', rarity: 'legendary', criteria: '50+ teams, 90%+ success', iconUrl: '/badges/mentorship-legend.svg', role: 'mentor' }
];

const ALL_BADGES = [
  ...PARTICIPANT_BADGES,
  ...ORGANIZER_BADGES,
  ...JUDGE_BADGES,
  ...MENTOR_BADGES
];

const initializeBadges = async () => {
  try {
    require('dotenv').config();
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Clear ALL existing badges
    const deleteResult = await Badge.deleteMany({});
    console.log(`✅ Cleared ${deleteResult.deletedCount} existing badges`);

    // Insert new badges
    const badges = await Badge.insertMany(ALL_BADGES);
    console.log(`✅ Inserted ${badges.length} new badges`);

    // Clear user badges that reference old badges
    const users = await User.find({});
    console.log(`Found ${users.length} users to update`);

    for (const user of users) {
      user.badges = [];
      await user.save();
      console.log(`✅ Cleared badges for user ${user.name || user.email}`);
    }

    console.log('🎉 Badge initialization complete!');
    console.log('📊 Summary:');
    console.log(`   - Deleted ${deleteResult.deletedCount} old badges`);
    console.log(`   - Inserted ${badges.length} new badges`);
    console.log(`   - Updated ${users.length} users`);
    console.log('📋 Badge breakdown:');
    console.log(`   - Participant badges: ${PARTICIPANT_BADGES.length}`);
    console.log(`   - Organizer badges: ${ORGANIZER_BADGES.length}`);
    console.log(`   - Judge badges: ${JUDGE_BADGES.length}`);
    console.log(`   - Mentor badges: ${MENTOR_BADGES.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing badges:', error);
    process.exit(1);
  }
};

initializeBadges(); 