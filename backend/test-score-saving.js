require('dotenv').config();
const mongoose = require('mongoose');
const { SubmissionSchema } = require('./schema/SubmissionSchema');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon-platform')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const Submission = mongoose.model('Submission', SubmissionSchema);

async function testScoreSaving() {
  console.log('🧪 Testing Score Saving...\n');
  
  try {
    // Find a hackathon with submissions
    const submissions = await Submission.find({ 
      roundIndex: 1,
      status: { $in: ['winner', 'shortlisted'] }
    }).populate('projectId', 'title')
      .populate('teamId', 'name')
      .populate('submittedBy', 'name email')
      .limit(5);
    
    console.log(`📊 Found ${submissions.length} submissions with scores:`);
    
    submissions.forEach((submission, index) => {
      console.log(`\n${index + 1}. Submission ID: ${submission._id}`);
      console.log(`   Project: ${submission.projectId?.title || 'No Title'}`);
      console.log(`   Team: ${submission.teamName || submission.teamId?.name || 'No Team'}`);
      console.log(`   Status: ${submission.status}`);
      console.log(`   PPT Score: ${submission.pptScore || 'Not set'}`);
      console.log(`   Project Score: ${submission.projectScore || 'Not set'}`);
      console.log(`   Combined Score: ${submission.combinedScore || 'Not set'}`);
      console.log(`   Submitted By: ${submission.submittedBy?.name || submission.submittedBy?.email || 'Unknown'}`);
    });
    
    // Check if scores are properly set
    const submissionsWithScores = submissions.filter(s => 
      s.pptScore > 0 || s.projectScore > 0 || s.combinedScore > 0
    );
    
    console.log(`\n📈 Submissions with scores: ${submissionsWithScores.length}/${submissions.length}`);
    
    if (submissionsWithScores.length > 0) {
      console.log('✅ Score saving is working correctly!');
      
      // Test email template with real data
      const { createWinnerEmailTemplate } = require('./templates/winnerEmailTemplate');
      
      const testWinner = submissionsWithScores[0];
      const winnerData = {
        _id: testWinner._id,
        projectTitle: testWinner.projectId?.title || testWinner.teamName || 'Untitled Project',
        teamName: testWinner.teamName || testWinner.teamId?.name || 'No Team',
        leaderName: testWinner.submittedBy?.name || testWinner.submittedBy?.email || 'Unknown',
        pptScore: testWinner.pptScore || 0,
        projectScore: testWinner.projectScore || 0,
        combinedScore: testWinner.combinedScore || 0
      };
      
      const hackathonData = {
        title: 'Test Hackathon',
        winners: submissionsWithScores.map(s => ({
          _id: s._id,
          projectTitle: s.projectId?.title || s.teamName || 'Untitled Project',
          teamName: s.teamName || s.teamId?.name || 'No Team',
          combinedScore: s.combinedScore || 0
        }))
      };
      
      console.log('\n📧 Testing email template with real data:');
      console.log('Winner Data:', winnerData);
      
      const htmlContent = createWinnerEmailTemplate(winnerData, hackathonData, 1);
      console.log('✅ Email template generated successfully');
      console.log('📧 HTML length:', htmlContent.length, 'characters');
      
    } else {
      console.log('⚠️  No submissions with scores found. This might be normal if no winners have been assigned yet.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testScoreSaving();
}

module.exports = { testScoreSaving }; 