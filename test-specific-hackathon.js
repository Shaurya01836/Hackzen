const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const TEST_HACKATHON_ID = '688859a6a3453e43c37bb706'; // The specific hackathon ID from user data
const TEST_USER_ID = '68812d04b545a72c5868a96b'; // The shortlisted user ID from user data
const TEST_SUBMISSION_ID = '6888584b8feacf0cef937ddb'; // The shortlisted submission ID from user data

// Test 1: Check hackathon data
async function checkHackathonData() {
  console.log('🧪 Testing hackathon data...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}`, {
      headers: {
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ Hackathon data:', {
      status: response.status,
      title: response.data.title,
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
    console.error('❌ Hackathon data check failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 2: Check leaderboard for Round 0 (PPT round)
async function checkRound0Leaderboard() {
  console.log('🧪 Testing Round 0 leaderboard...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/0/leaderboard`, {
      headers: {
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ Round 0 leaderboard:', {
      status: response.status,
      leaderboardCount: response.data.leaderboard?.length || 0,
      shortlistedCount: response.data.leaderboard?.filter(s => s.status === 'shortlisted').length || 0,
      summary: response.data.summary
    });
    
    if (response.data.leaderboard) {
      response.data.leaderboard.forEach((entry, index) => {
        console.log(`  Leaderboard Entry ${index}:`, {
          id: entry._id,
          title: entry.projectTitle,
          status: entry.status,
          averageScore: entry.averageScore,
          scoreCount: entry.scoreCount,
          teamName: entry.teamName
        });
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Round 0 leaderboard failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 3: Check leaderboard for Round 1 (Project round)
async function checkRound1Leaderboard() {
  console.log('🧪 Testing Round 1 leaderboard...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/1/leaderboard`, {
      headers: {
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ Round 1 leaderboard:', {
      status: response.status,
      leaderboardCount: response.data.leaderboard?.length || 0,
      shortlistedCount: response.data.leaderboard?.filter(s => s.status === 'shortlisted').length || 0,
      summary: response.data.summary
    });
    
    if (response.data.leaderboard) {
      response.data.leaderboard.forEach((entry, index) => {
        console.log(`  Leaderboard Entry ${index}:`, {
          id: entry._id,
          title: entry.projectTitle,
          status: entry.status,
          averageScore: entry.averageScore,
          scoreCount: entry.scoreCount,
          teamName: entry.teamName
        });
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Round 1 leaderboard failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 4: Check eligibility for Round 1 (Project round)
async function checkRound1Eligibility() {
  console.log('🧪 Testing Round 1 eligibility...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/1/eligibility`, {
      headers: {
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ Round 1 eligibility:', {
      status: response.status,
      eligible: response.data.eligible,
      shortlisted: response.data.shortlisted,
      message: response.data.message,
      shortlistingSource: response.data.shortlistingSource,
      roundStarted: response.data.roundStarted
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Round 1 eligibility failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 5: Check user submissions
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

// Test 6: Check user team
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

// Test 7: Test submission attempt for Round 1
async function testRound1SubmissionAttempt() {
  console.log('🧪 Testing Round 1 submission attempt...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/submission-form/submit`, {
      hackathonId: TEST_HACKATHON_ID,
      projectId: 'test-project-id', // Replace with actual project ID
      roundIndex: 1, // Round 1 (Project round)
      answers: {
        // Add any required form answers
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ Round 1 submission attempt response:', {
      status: response.status,
      message: response.data.message
    });
    
    return response.data;
  } catch (error) {
    console.log('❌ Round 1 submission attempt failed:', {
      status: error.response?.status,
      error: error.response?.data?.error || error.message
    });
    return null;
  }
}

// Main test function
async function runSpecificHackathonTests() {
  console.log('🚀 Starting specific hackathon tests...\n');
  
  try {
    // Test 1: Check hackathon data
    console.log('📋 Test 1: Checking hackathon data...');
    const hackathonData = await checkHackathonData();
    
    // Test 2: Check Round 0 leaderboard
    console.log('\n📋 Test 2: Checking Round 0 leaderboard...');
    const round0Leaderboard = await checkRound0Leaderboard();
    
    // Test 3: Check Round 1 leaderboard
    console.log('\n📋 Test 3: Checking Round 1 leaderboard...');
    const round1Leaderboard = await checkRound1Leaderboard();
    
    // Test 4: Check Round 1 eligibility
    console.log('\n📋 Test 4: Checking Round 1 eligibility...');
    const round1Eligibility = await checkRound1Eligibility();
    
    // Test 5: Check user submissions
    console.log('\n📋 Test 5: Checking user submissions...');
    const userSubmissions = await checkUserSubmissions();
    
    // Test 6: Check user team
    console.log('\n📋 Test 6: Checking user team...');
    const userTeam = await checkUserTeam();
    
    // Test 7: Test Round 1 submission attempt
    console.log('\n📋 Test 7: Testing Round 1 submission attempt...');
    const submissionResult = await testRound1SubmissionAttempt();
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('- Hackathon data:', hackathonData ? '✅ Success' : '❌ Failed');
    console.log('- Round 0 leaderboard:', round0Leaderboard ? '✅ Success' : '❌ Failed');
    console.log('- Round 1 leaderboard:', round1Leaderboard ? '✅ Success' : '❌ Failed');
    console.log('- Round 1 eligibility:', round1Eligibility ? '✅ Success' : '❌ Failed');
    console.log('- User submissions:', userSubmissions ? '✅ Success' : '❌ Failed');
    console.log('- User team:', userTeam ? '✅ Success' : '❌ Failed');
    console.log('- Round 1 submission attempt:', submissionResult ? '✅ Success' : '❌ Failed');
    
    if (round1Eligibility) {
      console.log('\n📈 Round 1 Eligibility Results:');
      console.log(`- Eligible: ${round1Eligibility.eligible}`);
      console.log(`- Shortlisted: ${round1Eligibility.shortlisted}`);
      console.log(`- Round started: ${round1Eligibility.roundStarted}`);
      console.log(`- Shortlisting source: ${round1Eligibility.shortlistingSource}`);
      console.log(`- Message: ${round1Eligibility.message}`);
      
      if (round1Eligibility.shortlisted && !round1Eligibility.eligible) {
        console.log('⚠️ User is shortlisted but not eligible (round may not have started)');
      } else if (!round1Eligibility.shortlisted) {
        console.log('⚠️ User is not shortlisted - this is the issue');
      } else {
        console.log('✅ User is properly shortlisted and eligible');
      }
    }
    
    if (round0Leaderboard && round1Leaderboard) {
      const round0Shortlisted = round0Leaderboard.leaderboard?.filter(s => s.status === 'shortlisted').length || 0;
      const round1Shortlisted = round1Leaderboard.leaderboard?.filter(s => s.status === 'shortlisted').length || 0;
      
      console.log('\n📈 Leaderboard Comparison:');
      console.log(`- Round 0 shortlisted: ${round0Shortlisted}`);
      console.log(`- Round 1 shortlisted: ${round1Shortlisted}`);
      
      if (round0Shortlisted > 0 && round1Shortlisted === 0) {
        console.log('⚠️ Shortlisted projects not showing in Round 1 leaderboard');
      } else if (round0Shortlisted === 0) {
        console.log('⚠️ No shortlisted projects in Round 0');
      } else {
        console.log('✅ Shortlisting appears to be working correctly');
      }
    }
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run the tests
if (require.main === module) {
  runSpecificHackathonTests().catch(console.error);
}

module.exports = {
  checkHackathonData,
  checkRound0Leaderboard,
  checkRound1Leaderboard,
  checkRound1Eligibility,
  checkUserSubmissions,
  checkUserTeam,
  testRound1SubmissionAttempt,
  runSpecificHackathonTests
}; 