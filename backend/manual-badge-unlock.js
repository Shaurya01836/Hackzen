const mongoose = require('mongoose');
const User = require('./model/UserModel');
const Badge = require('./model/BadgeModel');

// Manual badge unlock script for testing
const manualBadgeUnlock = async () => {
  try {
    require('dotenv').config();
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Configuration
    const userEmail = 'abc@gmail.com'; // Change this to test different users
    const badgeType = 'member'; // Change this to unlock different badges
    const userRole = 'participant'; // Change this to test different roles

    console.log(`\n🎯 Manual Badge Unlock Test`);
    console.log(`👤 User: ${userEmail}`);
    console.log(`🏆 Badge: ${badgeType}`);
    console.log(`👥 Role: ${userRole}`);

    // Find user
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      console.log(`❌ User not found: ${userEmail}`);
      return;
    }

    console.log(`\n👤 Found user: ${user.email} (${user.role})`);
    console.log(`📊 Current badges: ${user.badges.length}`);

    // Find badge
    const badge = await Badge.findOne({ type: badgeType, role: userRole });
    if (!badge) {
      console.log(`❌ Badge not found: ${badgeType} for role ${userRole}`);
      
      // Show available badges
      const availableBadges = await Badge.find({ role: userRole });
      console.log(`\n📋 Available badges for ${userRole} role:`);
      availableBadges.forEach(b => {
        console.log(`  - ${b.name} (${b.type})`);
      });
      return;
    }

    console.log(`\n🏆 Found badge: ${badge.name} (${badge.type})`);

    // Check if user already has this badge
    const hasBadge = user.badges.some(b => {
      const badgeId = b.badge?._id?.toString() || b.badge?.toString() || b.toString();
      return badgeId === badge._id.toString();
    });

    if (hasBadge) {
      console.log(`✅ User already has this badge`);
      return;
    }

    // Unlock the badge
    user.badges.push({ badge: badge._id, unlockedAt: new Date() });
    await user.save();

    console.log(`✅ Successfully unlocked badge: ${badge.name}`);
    console.log(`📊 User now has ${user.badges.length} badges`);

    // Show all user badges
    const userWithBadges = await User.findById(user._id).populate('badges.badge');
    console.log(`\n🏆 All user badges:`);
    userWithBadges.badges.forEach((badgeEntry, index) => {
      const badge = badgeEntry.badge;
      const unlockedAt = badgeEntry.unlockedAt;
      console.log(`  ${index + 1}. ${badge?.name || 'Unknown'} (${badge?.type || 'unknown'})`);
      console.log(`     - Unlocked: ${unlockedAt}`);
      console.log(`     - Rarity: ${badge?.rarity || 'unknown'}`);
    });

    console.log('\n✅ Manual badge unlock completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error unlocking badge:', error);
    process.exit(1);
  }
};

manualBadgeUnlock(); 