// Script to check and fix submission status
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hackathon_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const Submission = require('./backend/model/SubmissionModel');
const Hackathon = require('./backend/model/HackathonModel');

const HACKATHON_ID = '68883e9a075f6d9af98f7bea';

async function checkSubmissionStatus() {
  try {
    console.log('🔍 Checking submission status...');
    
    // Get all submissions for the hackathon
    const submissions = await Submission.find({ hackathonId: HACKATHON_ID });
    
    console.log(`📊 Found ${submissions.length} submissions:`);
    
    submissions.forEach((submission, index) => {
      console.log(`  ${index + 1}. ${submission.projectTitle || 'Untitled'}:`, {
        id: submission._id,
        status: submission.status,
        roundIndex: submission.roundIndex,
        shortlistedForRound: submission.shortlistedForRound,
        shortlistedAt: submission.shortlistedAt,
        submittedAt: submission.submittedAt
      });
    });
    
    // Check hackathon round progress
    const hackathon = await Hackathon.findById(HACKATHON_ID);
    console.log('\n🏆 Hackathon round progress:');
    
    if (hackathon.roundProgress) {
      hackathon.roundProgress.forEach((progress, index) => {
        console.log(`  Round ${index}:`, {
          roundIndex: progress.roundIndex,
          shortlistedSubmissions: progress.shortlistedSubmissions?.length || 0,
          shortlistedTeams: progress.shortlistedTeams?.length || 0,
          roundCompleted: progress.roundCompleted,
          shortlistedAt: progress.shortlistedAt
        });
      });
    }
    
    return { submissions, hackathon };
  } catch (error) {
    console.error('❌ Error checking submission status:', error);
    return null;
  }
}

async function fixSubmissionStatus() {
  try {
    console.log('🔧 Fixing submission status...');
    
    const hackathon = await Hackathon.findById(HACKATHON_ID);
    if (!hackathon || !hackathon.roundProgress || hackathon.roundProgress.length === 0) {
      console.log('❌ No round progress found, cannot fix status');
      return;
    }
    
    // Get round 0 progress
    const round0Progress = hackathon.roundProgress.find(rp => rp.roundIndex === 0);
    if (!round0Progress || !round0Progress.shortlistedSubmissions) {
      console.log('❌ No shortlisted submissions found in round 0');
      return;
    }
    
    console.log(`📝 Found ${round0Progress.shortlistedSubmissions.length} shortlisted submissions in round 0`);
    
    // Update submission status for shortlisted submissions
    const updatePromises = round0Progress.shortlistedSubmissions.map(async (submissionId) => {
      const result = await Submission.findByIdAndUpdate(submissionId, {
        status: 'shortlisted',
        shortlistedAt: round0Progress.shortlistedAt || new Date(),
        shortlistedForRound: 1 // Shortlist for round 1
      });
      
      console.log(`  ✅ Updated submission ${submissionId}:`, result ? 'Success' : 'Not found');
      return result;
    });
    
    await Promise.all(updatePromises);
    
    console.log('✅ All submission statuses updated');
    
    // Verify the updates
    const updatedSubmissions = await Submission.find({ 
      hackathonId: HACKATHON_ID,
      _id: { $in: round0Progress.shortlistedSubmissions }
    });
    
    console.log('\n📊 Verification - Updated submissions:');
    updatedSubmissions.forEach((submission, index) => {
      console.log(`  ${index + 1}. ${submission.projectTitle || 'Untitled'}:`, {
        status: submission.status,
        shortlistedAt: submission.shortlistedAt,
        shortlistedForRound: submission.shortlistedForRound
      });
    });
    
  } catch (error) {
    console.error('❌ Error fixing submission status:', error);
  }
}

async function main() {
  console.log('🚀 Starting submission status check and fix...\n');
  
  // Check current status
  const data = await checkSubmissionStatus();
  
  if (data) {
    console.log('\n🔧 Proceeding to fix submission status...\n');
    await fixSubmissionStatus();
  }
  
  console.log('\n✅ Process completed');
  process.exit(0);
}

// Run the script
main().catch(console.error); 