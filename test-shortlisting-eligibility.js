const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const TEST_HACKATHON_ID = 'your-test-hackathon-id'; // Replace with actual hackathon ID
const TEST_USER_ID = 'your-test-user-id'; // Replace with actual user ID

// Test 1: Check eligibility endpoint
async function checkEligibility() {
  console.log('🧪 Testing eligibility endpoint...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/1/eligibility`, {
      headers: {
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ Eligibility response:', {
      status: response.status,
      eligible: response.data.eligible,
      shortlisted: response.data.shortlisted,
      message: response.data.message,
      shortlistingSource: response.data.shortlistingSource,
      roundStarted: response.data.roundStarted
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Eligibility check failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 2: Check hackathon round progress
async function checkRoundProgress() {
  console.log('🧪 Testing hackathon round progress...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}`, {
      headers: {
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ Hackathon round progress:', {
      status: response.status,
      rounds: response.data.rounds?.length || 0,
      roundProgress: response.data.roundProgress?.length || 0
    });
    
    if (response.data.roundProgress) {
      response.data.roundProgress.forEach((progress, index) => {
        console.log(`  Round Progress ${index}:`, {
          roundIndex: progress.roundIndex,
          shortlistedSubmissions: progress.shortlistedSubmissions?.length || 0,
          shortlistedTeams: progress.shortlistedTeams?.length || 0,
          roundCompleted: progress.roundCompleted,
          shortlistedAt: progress.shortlistedAt
        });
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Round progress check failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 3: Check user submissions
async function checkUserSubmissions() {
  console.log('🧪 Testing user submissions...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/submission-form/user/${TEST_HACKATHON_ID}`, {
      headers: {
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ User submissions:', {
      status: response.status,
      submissions: response.data.submissions?.length || 0
    });
    
    if (response.data.submissions) {
      response.data.submissions.forEach((submission, index) => {
        console.log(`  Submission ${index}:`, {
          id: submission._id,
          projectTitle: submission.projectTitle,
          status: submission.status,
          roundIndex: submission.roundIndex,
          shortlistedForRound: submission.shortlistedForRound,
          shortlistedAt: submission.shortlistedAt
        });
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ User submissions check failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 4: Check user team
async function checkUserTeam() {
  console.log('🧪 Testing user team...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/teams/user/${TEST_HACKATHON_ID}`, {
      headers: {
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ User team:', {
      status: response.status,
      team: response.data.team ? {
        id: response.data.team._id,
        name: response.data.team.name,
        leader: response.data.team.leader,
        members: response.data.team.members?.length || 0
      } : 'No team'
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ User team check failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 5: Simulate submission attempt
async function testSubmissionAttempt() {
  console.log('🧪 Testing submission attempt...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/submission-form/submit`, {
      hackathonId: TEST_HACKATHON_ID,
      projectId: 'test-project-id', // Replace with actual project ID
      roundIndex: 1, // Round 2
      answers: {
        // Add any required form answers
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ Submission attempt response:', {
      status: response.status,
      message: response.data.message
    });
    
    return response.data;
  } catch (error) {
    console.log('❌ Submission attempt failed (expected if not shortlisted):', {
      status: error.response?.status,
      error: error.response?.data?.error || error.message
    });
    return null;
  }
}

// Main test function
async function runEligibilityTests() {
  console.log('🚀 Starting eligibility tests...\n');
  
  try {
    // Test 1: Check eligibility
    console.log('📋 Test 1: Checking eligibility...');
    const eligibility = await checkEligibility();
    
    // Test 2: Check round progress
    console.log('\n📋 Test 2: Checking round progress...');
    const roundProgress = await checkRoundProgress();
    
    // Test 3: Check user submissions
    console.log('\n📋 Test 3: Checking user submissions...');
    const userSubmissions = await checkUserSubmissions();
    
    // Test 4: Check user team
    console.log('\n📋 Test 4: Checking user team...');
    const userTeam = await checkUserTeam();
    
    // Test 5: Test submission attempt
    console.log('\n📋 Test 5: Testing submission attempt...');
    const submissionResult = await testSubmissionAttempt();
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('- Eligibility:', eligibility ? '✅ Success' : '❌ Failed');
    console.log('- Round progress:', roundProgress ? '✅ Success' : '❌ Failed');
    console.log('- User submissions:', userSubmissions ? '✅ Success' : '❌ Failed');
    console.log('- User team:', userTeam ? '✅ Success' : '❌ Failed');
    console.log('- Submission attempt:', submissionResult ? '✅ Success' : '❌ Failed');
    
    if (eligibility) {
      console.log('\n📈 Eligibility Results:');
      console.log(`- Eligible: ${eligibility.eligible}`);
      console.log(`- Shortlisted: ${eligibility.shortlisted}`);
      console.log(`- Round started: ${eligibility.roundStarted}`);
      console.log(`- Shortlisting source: ${eligibility.shortlistingSource}`);
      console.log(`- Message: ${eligibility.message}`);
      
      if (eligibility.shortlisted && !eligibility.eligible) {
        console.log('⚠️ User is shortlisted but not eligible (round may not have started)');
      } else if (!eligibility.shortlisted) {
        console.log('⚠️ User is not shortlisted - this may be the issue');
      } else {
        console.log('✅ User is properly shortlisted and eligible');
      }
    }
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run the tests
if (require.main === module) {
  runEligibilityTests().catch(console.error);
}

module.exports = {
  checkEligibility,
  checkRoundProgress,
  checkUserSubmissions,
  checkUserTeam,
  testSubmissionAttempt,
  runEligibilityTests
}; 