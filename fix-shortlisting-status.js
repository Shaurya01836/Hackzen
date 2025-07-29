const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hackathon_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const Submission = require('./backend/model/SubmissionModel');
const Hackathon = require('./backend/model/HackathonModel');

async function fixShortlistingStatus() {
  try {
    console.log('🔧 Starting shortlisting status fix...');
    
    // Get all hackathons with round progress
    const hackathons = await Hackathon.find({ 
      'roundProgress.0': { $exists: true } 
    }).select('_id title rounds roundProgress');
    
    console.log(`📊 Found ${hackathons.length} hackathons with round progress:`);
    
    for (const hackathon of hackathons) {
      console.log(`\n🏆 Processing hackathon: ${hackathon.title} (${hackathon._id})`);
      
      if (!hackathon.roundProgress || hackathon.roundProgress.length === 0) {
        console.log('  ⚠️ No round progress found, skipping...');
        continue;
      }
      
      // Process each round progress
      for (const progress of hackathon.roundProgress) {
        console.log(`  📋 Processing round ${progress.roundIndex}:`);
        console.log(`    - Shortlisted submissions: ${progress.shortlistedSubmissions?.length || 0}`);
        console.log(`    - Shortlisted teams: ${progress.shortlistedTeams?.length || 0}`);
        
        if (progress.shortlistedSubmissions && progress.shortlistedSubmissions.length > 0) {
          // Update submission statuses based on round progress
          const updatePromises = progress.shortlistedSubmissions.map(async (submissionId) => {
            try {
              const submission = await Submission.findById(submissionId);
              if (submission) {
                // Check if status needs to be updated
                if (submission.status !== 'shortlisted') {
                  console.log(`    🔧 Updating submission ${submissionId} status from '${submission.status}' to 'shortlisted'`);
                  
                  await Submission.findByIdAndUpdate(submissionId, {
                    status: 'shortlisted',
                    shortlistedAt: progress.shortlistedAt || new Date(),
                    shortlistedForRound: progress.roundIndex + 1
                  });
                  
                  return { id: submissionId, updated: true, oldStatus: submission.status };
                } else {
                  console.log(`    ✅ Submission ${submissionId} already has correct status: 'shortlisted'`);
                  return { id: submissionId, updated: false, status: submission.status };
                }
              } else {
                console.log(`    ⚠️ Submission ${submissionId} not found`);
                return { id: submissionId, updated: false, error: 'Not found' };
              }
            } catch (error) {
              console.log(`    ❌ Error updating submission ${submissionId}:`, error.message);
              return { id: submissionId, updated: false, error: error.message };
            }
          });
          
          const results = await Promise.all(updatePromises);
          const updatedCount = results.filter(r => r.updated).length;
          const errorCount = results.filter(r => r.error).length;
          
          console.log(`    📊 Round ${progress.roundIndex} results:`);
          console.log(`      - Updated: ${updatedCount}`);
          console.log(`      - Already correct: ${results.filter(r => !r.updated && !r.error).length}`);
          console.log(`      - Errors: ${errorCount}`);
        }
        
        // Also check for submissions that should NOT be shortlisted
        const submissionsForRound = await Submission.find({
          hackathonId: hackathon._id,
          roundIndex: progress.roundIndex
        });
        
        const incorrectlyShortlisted = submissionsForRound.filter(submission => {
          const isInShortlist = progress.shortlistedSubmissions?.includes(submission._id.toString());
          const isTeamShortlisted = submission.teamId && progress.shortlistedTeams?.includes(submission.teamId.toString());
          const isIndividualShortlisted = submission.submittedBy && progress.shortlistedTeams?.includes(submission.submittedBy.toString());
          
          return submission.status === 'shortlisted' && !isInShortlist && !isTeamShortlisted && !isIndividualShortlisted;
        });
        
        if (incorrectlyShortlisted.length > 0) {
          console.log(`    ⚠️ Found ${incorrectlyShortlisted.length} submissions incorrectly marked as shortlisted:`);
          
          for (const submission of incorrectlyShortlisted) {
            console.log(`      🔧 Fixing submission ${submission._id} (${submission.projectTitle || 'Untitled'})`);
            
            await Submission.findByIdAndUpdate(submission._id, {
              status: 'submitted',
              shortlistedAt: null,
              shortlistedForRound: null
            });
          }
        }
      }
    }
    
    console.log('\n✅ Shortlisting status fix completed');
    
  } catch (error) {
    console.error('❌ Error fixing shortlisting status:', error);
  }
}

async function verifyShortlistingStatus() {
  try {
    console.log('\n🔍 Verifying shortlisting status...');
    
    const hackathons = await Hackathon.find({}).select('_id title roundProgress');
    
    for (const hackathon of hackathons) {
      console.log(`\n🏆 Hackathon: ${hackathon.title}`);
      
      if (hackathon.roundProgress) {
        for (const progress of hackathon.roundProgress) {
          console.log(`  📋 Round ${progress.roundIndex}:`);
          
          // Get submissions for this round
          const submissions = await Submission.find({
            hackathonId: hackathon._id,
            roundIndex: progress.roundIndex
          });
          
          const shortlistedSubmissions = submissions.filter(s => s.status === 'shortlisted');
          const shouldBeShortlisted = progress.shortlistedSubmissions?.length || 0;
          
          console.log(`    - Submissions with 'shortlisted' status: ${shortlistedSubmissions.length}`);
          console.log(`    - Should be shortlisted according to round progress: ${shouldBeShortlisted}`);
          
          if (shortlistedSubmissions.length !== shouldBeShortlisted) {
            console.log(`    ⚠️ Mismatch detected!`);
          } else {
            console.log(`    ✅ Status matches`);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error verifying shortlisting status:', error);
  }
}

async function main() {
  console.log('🚀 Starting shortlisting status fix...\n');
  
  await fixShortlistingStatus();
  await verifyShortlistingStatus();
  
  console.log('\n✅ Process completed');
  process.exit(0);
}

// Run the script
main().catch(console.error); 