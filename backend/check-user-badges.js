const mongoose = require('mongoose');
const User = require('./model/UserModel');
const Badge = require('./model/BadgeModel');

const checkUserBadges = async () => {
  try {
    require('dotenv').config();
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Find user by email
    const userEmail = 'abc@gmail.com'; // Change this to test different users
    const user = await User.findOne({ email: userEmail }).populate('badges.badge');
    
    if (!user) {
      console.log(`❌ User not found: ${userEmail}`);
      return;
    }

    console.log(`\n👤 User: ${user.email} (${user.role})`);
    console.log(`📊 Total badges: ${user.badges.length}`);
    
    if (user.badges.length === 0) {
      console.log('❌ User has no badges');
    } else {
      console.log('\n🏆 User badges:');
      user.badges.forEach((badgeEntry, index) => {
        const badge = badgeEntry.badge;
        const unlockedAt = badgeEntry.unlockedAt;
        console.log(`  ${index + 1}. ${badge?.name || 'Unknown'} (${badge?.type || 'unknown'})`);
        console.log(`     - Unlocked: ${unlockedAt}`);
        console.log(`     - Badge ID: ${badge?._id || 'Unknown'}`);
      });
    }

    // Check all available badges
    const allBadges = await Badge.find({});
    console.log(`\n📋 Total available badges: ${allBadges.length}`);
    
    const roleCounts = {};
    allBadges.forEach(badge => {
      roleCounts[badge.role] = (roleCounts[badge.role] || 0) + 1;
    });
    console.log('Badge counts by role:', roleCounts);

    // Check member badge specifically
    const memberBadge = await Badge.findOne({ type: 'member' });
    if (memberBadge) {
      console.log(`\n🎯 Member badge found: ${memberBadge.name} (${memberBadge._id})`);
      const hasMemberBadge = user.badges.some(b => {
        const badgeId = b.badge?._id?.toString() || b.badge?.toString() || b.toString();
        return badgeId === memberBadge._id.toString();
      });
      console.log(`User has member badge: ${hasMemberBadge}`);
    }

    console.log('\n✅ Badge check completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking user badges:', error);
    process.exit(1);
  }
};

checkUserBadges(); 