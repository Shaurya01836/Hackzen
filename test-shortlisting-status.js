// Test script to check shortlisting status endpoint
const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_HACKATHON_ID = '68883e9a075f6d9af98f7bea';
const TEST_PARTICIPANT_TOKEN = 'your-participant-token'; // Replace with actual participant token

// Test shortlisting status endpoint
async function testShortlistingStatus() {
  try {
    console.log('🧪 Testing shortlisting status endpoint...');
    
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/shortlisting-status`, {
      headers: {
        Authorization: `Bearer ${TEST_PARTICIPANT_TOKEN}`
      }
    });
    
    console.log('✅ Shortlisting status response:', response.data);
    
    // Check the structure
    if (response.data.shortlistingStatus) {
      console.log('📊 Shortlisting status keys:', Object.keys(response.data.shortlistingStatus));
      
      Object.entries(response.data.shortlistingStatus).forEach(([key, value]) => {
        console.log(`  ${key}:`, {
          isShortlisted: value.isShortlisted,
          shortlistingSource: value.shortlistingSource,
          roundIndex: value.roundIndex,
          nextRoundIndex: value.nextRoundIndex,
          shortlistingDetails: value.shortlistingDetails
        });
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Shortlisting status failed:');
    console.error('  Status:', error.response?.status);
    console.error('  Status Text:', error.response?.statusText);
    console.error('  Error Message:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test hackathon data to see round progress
async function testHackathonRoundProgress() {
  try {
    console.log('🧪 Testing hackathon round progress...');
    
    const response = await axios.get(`${BASE_URL}/api/hackathons/${TEST_HACKATHON_ID}`, {
      headers: {
        Authorization: `Bearer ${TEST_PARTICIPANT_TOKEN}`
      }
    });
    
    console.log('✅ Hackathon data:', {
      title: response.data.title,
      rounds: response.data.rounds?.length || 0,
      roundProgress: response.data.roundProgress?.length || 0
    });
    
    if (response.data.roundProgress) {
      response.data.roundProgress.forEach((progress, index) => {
        console.log(`  Round ${index} progress:`, {
          roundIndex: progress.roundIndex,
          shortlistedSubmissions: progress.shortlistedSubmissions?.length || 0,
          shortlistedTeams: progress.shortlistedTeams?.length || 0,
          eligibleParticipants: progress.eligibleParticipants?.length || 0,
          roundCompleted: progress.roundCompleted,
          nextRoundEligibility: progress.nextRoundEligibility,
          shortlistedAt: progress.shortlistedAt
        });
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Hackathon data failed:', error.response?.data || error.message);
    return null;
  }
}

// Test submissions to see their status
async function testSubmissionsStatus() {
  try {
    console.log('🧪 Testing submissions status...');
    
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/submissions`, {
      headers: {
        Authorization: `Bearer ${TEST_PARTICIPANT_TOKEN}`
      }
    });
    
    console.log('✅ Submissions data:', {
      count: response.data.length,
      round0Submissions: response.data.filter(s => s.roundIndex === 0).length,
      round1Submissions: response.data.filter(s => s.roundIndex === 1).length,
      shortlistedSubmissions: response.data.filter(s => s.status === 'shortlisted').length
    });
    
    // Show details of each submission
    response.data.forEach((submission, index) => {
      console.log(`  Submission ${index}:`, {
        id: submission._id,
        projectTitle: submission.projectTitle,
        status: submission.status,
        roundIndex: submission.roundIndex,
        shortlistedForRound: submission.shortlistedForRound,
        shortlistedAt: submission.shortlistedAt
      });
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Submissions failed:', error.response?.data || error.message);
    return null;
  }
}

// Main test function
async function testShortlistingStatus() {
  console.log('🚀 Starting shortlisting status tests...\n');
  
  // Test 1: Get hackathon round progress
  const hackathonData = await testHackathonRoundProgress();
  
  // Test 2: Get submissions status
  const submissions = await testSubmissionsStatus();
  
  // Test 3: Get shortlisting status
  const shortlistingStatus = await testShortlistingStatus();
  
  console.log('\n📋 Test Summary:');
  console.log('- Hackathon Data:', hackathonData ? '✅' : '❌');
  console.log('- Submissions:', submissions ? `${submissions.length} total` : 'Failed');
  console.log('- Shortlisting Status:', shortlistingStatus ? '✅' : '❌');
  
  if (shortlistingStatus) {
    console.log('\n📊 Shortlisting Status Analysis:');
    console.log('- Total Rounds:', shortlistingStatus.totalRounds);
    console.log('- User Team:', shortlistingStatus.userTeam);
    console.log('- Shortlisting Status Keys:', Object.keys(shortlistingStatus.shortlistingStatus || {}));
    
    // Check if user is shortlisted
    const shortlistingEntries = Object.values(shortlistingStatus.shortlistingStatus || {});
    const isShortlisted = shortlistingEntries.some(entry => entry.isShortlisted);
    console.log('- User is shortlisted:', isShortlisted);
    
    if (isShortlisted) {
      const shortlistedEntry = shortlistingEntries.find(entry => entry.isShortlisted);
      console.log('- Shortlisting details:', shortlistedEntry);
    }
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testShortlistingStatus().catch(console.error);
}

module.exports = {
  testShortlistingStatus,
  testHackathonRoundProgress,
  testSubmissionsStatus
}; 