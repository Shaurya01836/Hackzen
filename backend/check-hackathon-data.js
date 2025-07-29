// Script to check hackathon data and submissions
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hackathon_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const Submission = require('./model/SubmissionModel');
const Hackathon = require('./model/HackathonModel');

async function checkHackathonData() {
  try {
    console.log('🔍 Checking hackathon data...');
    
    // Get all hackathons
    const hackathons = await Hackathon.find({}).select('_id title rounds roundProgress');
    
    console.log(`📊 Found ${hackathons.length} hackathons:`);
    
    hackathons.forEach((hackathon, index) => {
      console.log(`  ${index + 1}. ${hackathon.title}:`, {
        id: hackathon._id,
        rounds: hackathon.rounds?.length || 0,
        roundProgress: hackathon.roundProgress?.length || 0
      });
      
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
    });
    
    // Get all submissions
    const submissions = await Submission.find({}).select('_id hackathonId projectTitle status roundIndex shortlistedForRound shortlistedAt');
    
    console.log(`\n📊 Found ${submissions.length} submissions:`);
    
    submissions.forEach((submission, index) => {
      console.log(`  ${index + 1}. ${submission.projectTitle || 'Untitled'}:`, {
        id: submission._id,
        hackathonId: submission.hackathonId,
        status: submission.status,
        roundIndex: submission.roundIndex,
        shortlistedForRound: submission.shortlistedForRound,
        shortlistedAt: submission.shortlistedAt
      });
    });
    
    return { hackathons, submissions };
  } catch (error) {
    console.error('❌ Error checking hackathon data:', error);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting hackathon data check...\n');
  
  await checkHackathonData();
  
  console.log('\n✅ Process completed');
  process.exit(0);
}

// Run the script
main().catch(console.error); 