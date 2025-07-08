const mongoose = require('mongoose');
const User = require('./model/UserModel');
const Badge = require('./model/BadgeModel');

const clearBadges = async () => {
  try {
    require('dotenv').config();
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    // Clear all badges from database
    const badgeResult = await Badge.deleteMany({});
    console.log(`🗑️  Deleted ${badgeResult.deletedCount} badges from database`);

    // Clear all user badges
    const userResult = await User.updateMany({}, { $set: { badges: [] } });
    console.log(`🧹 Cleared badges from ${userResult.modifiedCount} users`);

    // Verify cleanup
    const badgeCount = await Badge.countDocuments();
    const usersWithBadges = await User.countDocuments({ 'badges.0': { $exists: true } });
    
    console.log(`\n✅ Cleanup completed:`);
    console.log(`   - Badges in database: ${badgeCount}`);
    console.log(`   - Users with badges: ${usersWithBadges}`);

    console.log('\n📋 Next steps:');
    console.log('1. Run: node scripts/initBadges.js');
    console.log('2. Restart your backend server');
    console.log('3. Login to trigger badge unlocking');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing badges:', error);
    process.exit(1);
  }
};

clearBadges(); 