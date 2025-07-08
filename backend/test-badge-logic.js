const mongoose = require('mongoose');
const User = require('./model/UserModel');
const Badge = require('./model/BadgeModel');
const { checkAndUnlockBadges } = require('./controllers/badgeController');

// Connect to MongoDB
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testBadgeSystem = async () => {
  try {
    // console.log('🧪 Starting comprehensive badge system test...\n');
    
    // 1. Check if badges exist
    const badges = await Badge.find();
    // console.log(`📊 Found ${badges.length} badges in database`);
    
    if (badges.length === 0) {
      // console.log('❌ No badges found! Please run the badge initialization script first.');
      return;
    }
    
    // 2. Check users
    const users = await User.find().populate('badges.badge');
    // console.log(`👥 Found ${users.length} users in database\n`);
    
    // 3. Test badge unlocking for each user
    for (const user of users) {
      // console.log(`\n🔍 Testing user: ${user.email} (${user.role})`);
      // console.log(`📊 Current badges: ${user.badges.length}`);
      
      // Show current badges
      if (user.badges.length > 0) {
        // console.log('🏆 Current badges:');
        user.badges.forEach((userBadge, index) => {
          const badge = userBadge.badge;
          if (badge) {
            // console.log(`   ${index + 1}. ${badge.name} (${badge.type}) - ${badge.role}`);
          }
        });
      }
      
      // Test badge unlocking
      // console.log('\n🔄 Running badge check...');
      const unlockedBadges = await checkAndUnlockBadges(user._id, true);
      
      if (unlockedBadges.length > 0) {
        // console.log(`🎉 Unlocked ${unlockedBadges.length} new badges:`);
        unlockedBadges.forEach(badge => {
          // console.log(`   ✅ ${badge.name} (${badge.type}) - ${badge.role}`);
        });
      } else {
        // console.log('ℹ️ No new badges unlocked');
      }
      
      // Refresh user data
      const updatedUser = await User.findById(user._id).populate('badges.badge');
      // console.log(`📊 Updated badge count: ${updatedUser.badges.length}`);
      
      // Check for duplicates
      const badgeIds = updatedUser.badges.map(b => b.badge?._id?.toString() || b.badge?.toString());
      const uniqueBadgeIds = new Set(badgeIds);
      
      if (badgeIds.length !== uniqueBadgeIds.size) {
        // console.log(`⚠️ WARNING: User has ${badgeIds.length - uniqueBadgeIds.size} duplicate badges!`);
      }
    }
    
    // 4. Summary
    // console.log('\n📋 Badge System Test Summary:');
    // console.log(`   - Total badges in system: ${badges.length}`);
    // console.log(`   - Total users: ${users.length}`);
    
    const totalUserBadges = users.reduce((sum, user) => sum + user.badges.length, 0);
    // console.log(`   - Total user badges: ${totalUserBadges}`);
    
    // 5. Role-specific badge counts
    const roleBadgeCounts = {};
    users.forEach(user => {
      if (!roleBadgeCounts[user.role]) {
        roleBadgeCounts[user.role] = { count: 0, users: 0 };
      }
      roleBadgeCounts[user.role].count += user.badges.length;
      roleBadgeCounts[user.role].users += 1;
    });
    
    // console.log('\n👥 Badge distribution by role:');
    Object.entries(roleBadgeCounts).forEach(([role, data]) => {
      // console.log(`   ${role}: ${data.count} badges across ${data.users} users`);
    });
    
    // console.log('\n✅ Badge system test completed!');
    
  } catch (error) {
    // console.error('❌ Error during badge system test:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the test
testBadgeSystem(); 