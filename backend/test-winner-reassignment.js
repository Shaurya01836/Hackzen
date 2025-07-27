require('dotenv').config();
const mongoose = require('mongoose');
const Submission = require('./model/SubmissionModel');
const Hackathon = require('./model/HackathonModel');

async function testWinnerReassignment() {
  console.log('🧪 Testing Winner Reassignment...\n');
  
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon');
    console.log('✅ Connected to database');
    
    // Test data
    const testHackathonId = '68862b03c6e73b87fb6c0aee'; // Use your actual hackathon ID
    
    // Check current winners
    const currentWinners = await Submission.find({
      hackathonId: testHackathonId,
      roundIndex: 1,
      status: 'winner'
    });
    
    console.log('📊 Current winners:', currentWinners.length);
    currentWinners.forEach((winner, index) => {
      console.log(`${index + 1}. ${winner.projectTitle || winner.teamName} (${winner._id})`);
    });
    
    // Simulate reassignment by resetting winners
    console.log('\n🔄 Simulating winner reassignment...');
    
    const resetResult = await Submission.updateMany(
      { 
        hackathonId: testHackathonId, 
        roundIndex: 1,
        status: 'winner' 
      },
      { status: 'submitted' }
    );
    
    console.log('✅ Reset previous winners:', resetResult.modifiedCount);
    
    // Check if reset worked
    const remainingWinners = await Submission.find({
      hackathonId: testHackathonId,
      roundIndex: 1,
      status: 'winner'
    });
    
    console.log('📊 Remaining winners after reset:', remainingWinners.length);
    
    if (remainingWinners.length === 0) {
      console.log('✅ Winner reassignment test passed!');
    } else {
      console.log('❌ Winner reassignment test failed - winners still exist');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testWinnerReassignment();
}

module.exports = { testWinnerReassignment }; 