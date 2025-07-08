const mongoose = require('mongoose');
const User = require('./model/UserModel');
const Badge = require('./model/BadgeModel');

// Connect to MongoDB
require('dotenv').config();

const simpleCleanup = async () => {
  try {
    console.log('🧹 Simple badge cleanup starting...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');
    
    // Check badges exist
    const badges = await Badge.find();
    console.log(`📊 Found ${badges.length} badges in database`);
    
    if (badges.length === 0) {
      console.log('❌ No badges found! Run: node scripts/initBadges.js');
      return;
    }
    
    // Get all users
    const users = await User.find().populate('badges.badge');
    console.log(`👥 Found ${users.length} users`);
    
    let totalDuplicatesRemoved = 0;
    let totalUsersProcessed = 0;
    
    // Process each user
    for (const user of users) {
      totalUsersProcessed++;
      console.log(`\n👤 Processing user ${totalUsersProcessed}/${users.length}: ${user.email}`);
      
      const beforeCount = user.badges.length;
      
      // Create a map to track unique badges
      const uniqueBadges = new Map();
      const duplicates = [];
      
      for (const userBadge of user.badges) {
        const badgeId = userBadge.badge?._id?.toString() || userBadge.badge?.toString();
        
        if (uniqueBadges.has(badgeId)) {
          duplicates.push(userBadge._id);
        } else {
          uniqueBadges.set(badgeId, userBadge);
        }
      }
      
      if (duplicates.length > 0) {
        console.log(`   🗑️ Removing ${duplicates.length} duplicate badges`);
        totalDuplicatesRemoved += duplicates.length;
        
        // Remove duplicates
        user.badges = user.badges.filter(badge => !duplicates.includes(badge._id));
        await user.save();
        
        const afterCount = user.badges.length;
        console.log(`   ✅ Cleaned up: ${beforeCount} → ${afterCount} badges`);
      } else {
        console.log(`   ✅ No duplicates found (${beforeCount} badges)`);
      }
    }
    
    // Final summary
    console.log('\n📋 Cleanup Summary:');
    console.log(`   - Users processed: ${totalUsersProcessed}`);
    console.log(`   - Duplicates removed: ${totalDuplicatesRemoved}`);
    console.log(`   - Badges in system: ${badges.length}`);
    
    console.log('\n✅ Cleanup completed successfully!');
    console.log('🎯 Next steps:');
    console.log('   1. Restart your backend server');
    console.log('   2. Refresh your frontend');
    console.log('   3. Check badge display in UI');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the cleanup
simpleCleanup(); 