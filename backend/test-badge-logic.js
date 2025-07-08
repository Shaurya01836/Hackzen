const mongoose = require('mongoose');
const User = require('./model/UserModel');
const Badge = require('./model/BadgeModel');
const { checkAndUnlockBadges } = require('./controllers/badgeController');

// Test badge logic
const testBadgeLogic = async () => {
  try {
    require('dotenv').config();
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Test 1: Check if member badge unlocks for any user
    console.log('\n🧪 Test 1: Member Badge');
    const testUser = await User.findOne({});
    if (testUser) {
      console.log(`Testing with user: ${testUser.email} (${testUser.role})`);
      console.log(`Current badges: ${testUser.badges.length}`);
      console.log('Badge details:', JSON.stringify(testUser.badges, null, 2));
      
      const unlockedBadges = await checkAndUnlockBadges(testUser._id);
      console.log(`Unlocked badges: ${unlockedBadges.length}`);
      unlockedBadges.forEach(badge => {
        console.log(`  - ${badge.name} (${badge.type})`);
      });
      
      // Check user after badge check
      const updatedUser = await User.findById(testUser._id).populate('badges.badge');
      console.log(`\nAfter badge check - User badges: ${updatedUser.badges.length}`);
      console.log('Updated badge details:', JSON.stringify(updatedUser.badges, null, 2));
    }

    // Test 2: Check all badges for different roles
    console.log('\n🧪 Test 2: Role-based Badges');
    const users = await User.find({}).limit(3);
    for (const user of users) {
      console.log(`\nChecking badges for ${user.email} (${user.role}):`);
      console.log(`Before: ${user.badges.length} badges`);
      
      const unlockedBadges = await checkAndUnlockBadges(user._id);
      console.log(`  Unlocked: ${unlockedBadges.length} badges`);
      unlockedBadges.forEach(badge => {
        console.log(`    - ${badge.name} (${badge.type})`);
      });
      
      // Check after
      const updatedUser = await User.findById(user._id).populate('badges.badge');
      console.log(`After: ${updatedUser.badges.length} badges`);
    }

    // Test 3: Check badge counts by role
    console.log('\n🧪 Test 3: Badge Counts by Role');
    const badges = await Badge.find({});
    const roleCounts = {};
    badges.forEach(badge => {
      roleCounts[badge.role] = (roleCounts[badge.role] || 0) + 1;
    });
    console.log('Badge counts by role:', roleCounts);

    console.log('\n✅ Badge logic tests completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing badge logic:', error);
    process.exit(1);
  }
};

testBadgeLogic(); 