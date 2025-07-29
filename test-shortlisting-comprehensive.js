const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const TEST_HACKATHON_ID = 'your-test-hackathon-id'; // Replace with actual hackathon ID
const TEST_SUBMISSION_ID = 'your-test-submission-id'; // Replace with actual submission ID

// Test 1: Check current shortlisting status
async function checkCurrentShortlistingStatus() {
  console.log('🧪 Testing current shortlisting status...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/0/leaderboard`, {
      headers: {
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ Leaderboard response:', {
      status: response.status,
      leaderboardCount: response.data.leaderboard?.length || 0,
      shortlistedCount: response.data.leaderboard?.filter(s => s.status === 'shortlisted').length || 0,
      summary: response.data.summary
    });
    
    // Show details of each leaderboard entry
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
    console.error('❌ Leaderboard check failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 2: Perform shortlisting
async function performShortlisting() {
  console.log('🧪 Testing shortlisting functionality...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/0/shortlist`, {
      mode: 'topN',
      shortlistCount: 2
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ Shortlisting response:', {
      status: response.status,
      message: response.data.message,
      shortlistedSubmissions: response.data.shortlistedSubmissions?.length || 0,
      shortlistedTeams: response.data.shortlistedTeams?.length || 0
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Shortlisting failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 3: Check shortlisting status after shortlisting
async function checkShortlistingStatusAfter() {
  console.log('🧪 Testing shortlisting status after shortlisting...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/0/leaderboard`, {
      headers: {
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ Post-shortlisting leaderboard:', {
      status: response.status,
      leaderboardCount: response.data.leaderboard?.length || 0,
      shortlistedCount: response.data.leaderboard?.filter(s => s.status === 'shortlisted').length || 0,
      summary: response.data.summary
    });
    
    // Show details of shortlisted entries
    const shortlistedEntries = response.data.leaderboard?.filter(s => s.status === 'shortlisted') || [];
    console.log('✅ Shortlisted entries:', shortlistedEntries.length);
    shortlistedEntries.forEach((entry, index) => {
      console.log(`  Shortlisted Entry ${index}:`, {
        id: entry._id,
        title: entry.projectTitle,
        status: entry.status,
        averageScore: entry.averageScore,
        teamName: entry.teamName
      });
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Post-shortlisting check failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 4: Check participant eligibility
async function checkParticipantEligibility() {
  console.log('🧪 Testing participant eligibility...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/1/eligibility`, {
      headers: {
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ Eligibility response:', {
      status: response.status,
      isShortlisted: response.data.isShortlisted,
      shortlistingSource: response.data.shortlistingSource,
      shortlistingDetails: response.data.shortlistingDetails
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Eligibility check failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 5: Check hackathon round progress
async function checkHackathonRoundProgress() {
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

// Test 6: Toggle individual submission shortlist
async function toggleIndividualShortlist() {
  console.log('🧪 Testing individual shortlist toggle...');
  
  try {
    const response = await axios.post(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/0/toggle-shortlist`, {
      submissionId: TEST_SUBMISSION_ID,
      shortlist: true
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-test-token' // Replace with actual token
      }
    });
    
    console.log('✅ Toggle shortlist response:', {
      status: response.status,
      message: response.data.message
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Toggle shortlist failed:', error.response?.data || error.message);
    return null;
  }
}

// Main test function
async function runComprehensiveTests() {
  console.log('🚀 Starting comprehensive shortlisting tests...\n');
  
  try {
    // Test 1: Check initial status
    console.log('📋 Test 1: Checking initial shortlisting status...');
    const initialStatus = await checkCurrentShortlistingStatus();
    
    // Test 2: Check round progress
    console.log('\n📋 Test 2: Checking hackathon round progress...');
    const roundProgress = await checkHackathonRoundProgress();
    
    // Test 3: Perform shortlisting
    console.log('\n📋 Test 3: Performing shortlisting...');
    const shortlistingResult = await performShortlisting();
    
    // Test 4: Check status after shortlisting
    console.log('\n📋 Test 4: Checking status after shortlisting...');
    const postShortlistingStatus = await checkShortlistingStatusAfter();
    
    // Test 5: Check participant eligibility
    console.log('\n📋 Test 5: Checking participant eligibility...');
    const eligibility = await checkParticipantEligibility();
    
    // Test 6: Toggle individual shortlist
    console.log('\n📋 Test 6: Testing individual shortlist toggle...');
    const toggleResult = await toggleIndividualShortlist();
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('- Initial status:', initialStatus ? '✅ Success' : '❌ Failed');
    console.log('- Round progress:', roundProgress ? '✅ Success' : '❌ Failed');
    console.log('- Shortlisting:', shortlistingResult ? '✅ Success' : '❌ Failed');
    console.log('- Post-shortlisting status:', postShortlistingStatus ? '✅ Success' : '❌ Failed');
    console.log('- Eligibility:', eligibility ? '✅ Success' : '❌ Failed');
    console.log('- Toggle shortlist:', toggleResult ? '✅ Success' : '❌ Failed');
    
    if (initialStatus && postShortlistingStatus) {
      const initialShortlisted = initialStatus.leaderboard?.filter(s => s.status === 'shortlisted').length || 0;
      const postShortlisted = postShortlistingStatus.leaderboard?.filter(s => s.status === 'shortlisted').length || 0;
      
      console.log(`\n📈 Shortlisting Results:`);
      console.log(`- Initial shortlisted: ${initialShortlisted}`);
      console.log(`- Post-shortlisting: ${postShortlisted}`);
      console.log(`- Change: ${postShortlisted - initialShortlisted}`);
      
      if (postShortlisted > initialShortlisted) {
        console.log('✅ Shortlisting appears to be working correctly');
      } else {
        console.log('⚠️ Shortlisting may not be working as expected');
      }
    }
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Run the tests
if (require.main === module) {
  runComprehensiveTests().catch(console.error);
}

module.exports = {
  checkCurrentShortlistingStatus,
  performShortlisting,
  checkShortlistingStatusAfter,
  checkParticipantEligibility,
  checkHackathonRoundProgress,
  toggleIndividualShortlist,
  runComprehensiveTests
}; 