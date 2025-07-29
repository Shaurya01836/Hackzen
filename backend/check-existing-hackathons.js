// Script to check existing hackathons and their submissions
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hackathon_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const Submission = require('./model/SubmissionModel');
const Hackathon = require('./model/HackathonModel');

async function checkExistingHackathons() {
  try {
    console.log('🔍 Checking existing hackathons...');
    
    // Get all hackathons
    const hackathons = await Hackathon.find({}).select('_id title rounds roundProgress');
    
    console.log(`📊 Found ${hackathons.length} hackathons:`);
    
    for (const hackathon of hackathons) {
      console.log(`\n🏆 ${hackathon.title} (${hackathon._id}):`);
      console.log(`  Rounds: ${hackathon.rounds?.length || 0}`);
      console.log(`  Round Progress: ${hackathon.roundProgress?.length || 0}`);
      
      if (hackathon.roundProgress) {
        hackathon.roundProgress.forEach((progress, pIndex) => {
          console.log(`    Round ${pIndex} progress:`, {
            roundIndex: progress.roundIndex,
            shortlistedSubmissions: progress.shortlistedSubmissions?.length || 0,
            shortlistedTeams: progress.shortlistedTeams?.length || 0,
            roundCompleted: progress.roundCompleted,
            shortlistedAt: progress.shortlistedAt
          });
        });
      }
      
      // Get submissions for this hackathon
      const submissions = await Submission.find({ hackathonId: hackathon._id }).select('_id projectTitle status roundIndex shortlistedForRound shortlistedAt');
      
      console.log(`  Submissions: ${submissions.length}`);
      submissions.forEach((submission, index) => {
        console.log(`    ${index + 1}. ${submission.projectTitle || 'Untitled'}:`, {
          id: submission._id,
          status: submission.status,
          roundIndex: submission.roundIndex,
          shortlistedForRound: submission.shortlistedForRound,
          shortlistedAt: submission.shortlistedAt
        });
      });
    }
    
    return hackathons;
  } catch (error) {
    console.error('❌ Error checking existing hackathons:', error);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting existing hackathons check...\n');
  
  await checkExistingHackathons();
  
  console.log('\n✅ Process completed');
  process.exit(0);
}

// Run the script
main().catch(console.error); 