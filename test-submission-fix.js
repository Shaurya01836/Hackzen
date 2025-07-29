const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hackathon_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import models
const Hackathon = require('./backend/model/HackathonModel');
const Submission = require('./backend/model/SubmissionModel');
const Team = require('./backend/model/TeamModel');

const TEST_HACKATHON_ID = '688859a6a3453e43c37bb706';
const TEST_USER_ID = '68812d04b545a72c5868a96b';
const TEST_SUBMISSION_ID = '6888584b8feacf0cef937ddb';

async function testSubmissionValidation() {
  try {
    console.log('🧪 Testing submission validation logic...\n');
    
    // Get hackathon data
    const hackathon = await Hackathon.findById(TEST_HACKATHON_ID);
    if (!hackathon) {
      console.error('❌ Hackathon not found');
      return;
    }
    
    console.log('📊 Hackathon data:', {
      title: hackathon.title,
      rounds: hackathon.rounds?.length || 0,
      roundProgress: hackathon.roundProgress?.length || 0
    });
    
    // Get user team
    const userTeam = await Team.findOne({ 
      hackathon: TEST_HACKATHON_ID, 
      members: TEST_USER_ID, 
      status: 'active' 
    });
    
    console.log('👥 User team:', userTeam ? {
      id: userTeam._id,
      name: userTeam.name,
      leader: userTeam.leader
    } : 'No team');
    
    // Test submission validation logic
    let isShortlisted = false;
    const roundIndex = 1; // Round 1 (Project round)
    
    console.log('\n🔍 Testing shortlisting validation for Round 1...');
    
    if (userTeam) {
      console.log('🔍 User has team, checking team-based shortlisting...');
      
      // Check all round progress entries for shortlisting
      if (hackathon.roundProgress) {
        for (const progress of hackathon.roundProgress) {
          console.log(`🔍 Checking round ${progress.roundIndex}:`, {
            shortlistedTeams: progress.shortlistedTeams?.length || 0,
            shortlistedSubmissions: progress.shortlistedSubmissions?.length || 0
          });
          
          // Check if user is directly shortlisted in any round
          if (progress.shortlistedTeams && progress.shortlistedTeams.includes(TEST_USER_ID.toString())) {
            isShortlisted = true;
            console.log(`✅ User shortlisted via direct shortlisting in round ${progress.roundIndex}`);
            break;
          }
          
          // Check if team is shortlisted in any round
          if (progress.shortlistedTeams && progress.shortlistedTeams.includes(userTeam._id.toString())) {
            isShortlisted = true;
            console.log(`✅ User shortlisted via team shortlisting in round ${progress.roundIndex}`);
            break;
          }
        }
      }
      
      // Check submission-based shortlisting
      if (!isShortlisted) {
        console.log('🔍 Checking submission-based shortlisting...');
        const userSubmissions = await Submission.find({
          hackathonId: TEST_HACKATHON_ID,
          $or: [
            { teamId: userTeam._id },
            { submittedBy: TEST_USER_ID }
          ],
          roundIndex: 0 // Round 0 (PPT round)
        });
        
        console.log(`🔍 Found ${userSubmissions.length} user submissions for Round 0`);
        
        if (userSubmissions.length > 0) {
          const roundProgress = hackathon.roundProgress?.find(rp => rp.roundIndex === 0);
          if (roundProgress && roundProgress.shortlistedSubmissions) {
            const userSubmissionIds = userSubmissions.map(s => s._id.toString());
            const hasShortlistedSubmission = userSubmissionIds.some(id => 
              roundProgress.shortlistedSubmissions.includes(id)
            );
            
            if (hasShortlistedSubmission) {
              isShortlisted = true;
              console.log('✅ User shortlisted via submission');
            }
          }
        }
      }
    } else {
      console.log('🔍 User has no team, checking individual shortlisting...');
      
      // Check all round progress entries for individual shortlisting
      if (hackathon.roundProgress) {
        for (const progress of hackathon.roundProgress) {
          console.log(`🔍 Checking round ${progress.roundIndex}:`, {
            shortlistedTeams: progress.shortlistedTeams?.length || 0,
            shortlistedSubmissions: progress.shortlistedSubmissions?.length || 0
          });
          
          // Check if user is directly shortlisted in any round
          if (progress.shortlistedTeams && progress.shortlistedTeams.includes(TEST_USER_ID.toString())) {
            isShortlisted = true;
            console.log(`✅ Individual user shortlisted via direct shortlisting in round ${progress.roundIndex}`);
            break;
          }
        }
      }
      
      // Check submission-based shortlisting
      if (!isShortlisted) {
        console.log('🔍 Checking individual submission-based shortlisting...');
        const userSubmissions = await Submission.find({
          hackathonId: TEST_HACKATHON_ID,
          submittedBy: TEST_USER_ID,
          roundIndex: 0 // Round 0 (PPT round)
        });
        
        console.log(`🔍 Found ${userSubmissions.length} individual user submissions for Round 0`);
        
        if (userSubmissions.length > 0) {
          const roundProgress = hackathon.roundProgress?.find(rp => rp.roundIndex === 0);
          if (roundProgress && roundProgress.shortlistedSubmissions) {
            const userSubmissionIds = userSubmissions.map(s => s._id.toString());
            const hasShortlistedSubmission = userSubmissionIds.some(id => 
              roundProgress.shortlistedSubmissions.includes(id)
            );
            
            if (hasShortlistedSubmission) {
              isShortlisted = true;
              console.log('✅ Individual user shortlisted via submission');
            }
          }
        }
      }
    }
    
    // Check individual submission status
    if (!isShortlisted) {
      console.log('🔍 Checking individual submission status...');
      const shortlistedSubmission = await Submission.findOne({
        hackathonId: TEST_HACKATHON_ID,
        submittedBy: TEST_USER_ID,
        shortlistedForRound: roundIndex + 1,
        status: 'shortlisted'
      });
      
      if (shortlistedSubmission) {
        isShortlisted = true;
        console.log('✅ User shortlisted via individual submission status');
      }
    }
    
    console.log('\n📊 Final Results:');
    console.log(`- User ID: ${TEST_USER_ID}`);
    console.log(`- Team: ${userTeam ? userTeam._id : 'No team'}`);
    console.log(`- Shortlisted: ${isShortlisted ? '✅ YES' : '❌ NO'}`);
    console.log(`- Can submit to Round 1: ${isShortlisted ? '✅ YES' : '❌ NO'}`);
    
    if (isShortlisted) {
      console.log('\n✅ User should be able to submit to Round 1!');
    } else {
      console.log('\n❌ User cannot submit to Round 1 - shortlisting validation failed');
    }
    
    // Show round progress data
    console.log('\n📋 Round Progress Data:');
    if (hackathon.roundProgress) {
      hackathon.roundProgress.forEach((progress, index) => {
        console.log(`  Round ${progress.roundIndex}:`, {
          shortlistedTeams: progress.shortlistedTeams?.length || 0,
          shortlistedSubmissions: progress.shortlistedSubmissions?.length || 0,
          roundCompleted: progress.roundCompleted,
          shortlistedAt: progress.shortlistedAt
        });
        
        if (progress.shortlistedTeams) {
          console.log(`    Shortlisted teams: ${progress.shortlistedTeams.join(', ')}`);
        }
        if (progress.shortlistedSubmissions) {
          console.log(`    Shortlisted submissions: ${progress.shortlistedSubmissions.join(', ')}`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the test
if (require.main === module) {
  testSubmissionValidation().catch(console.error);
}

module.exports = { testSubmissionValidation }; 