// Test script to check participant shortlisting status
const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_HACKATHON_ID = '68883e9a075f6d9af98f7bea';
const TEST_PARTICIPANT_TOKEN = 'your-participant-token'; // Replace with actual participant token

// Test participant shortlisting status
async function testParticipantShortlistingStatus() {
  try {
    console.log('🧪 Testing participant shortlisting status...');
    
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/shortlisting-status`, {
      headers: {
        Authorization: `Bearer ${TEST_PARTICIPANT_TOKEN}`
      }
    });
    
    console.log('✅ Participant shortlisting status:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Participant shortlisting status failed:');
    console.error('  Status:', error.response?.status);
    console.error('  Status Text:', error.response?.statusText);
    console.error('  Error Message:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test participant eligibility for round 1
async function testParticipantEligibility() {
  try {
    console.log('🧪 Testing participant eligibility for round 1...');
    
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/1/eligibility`, {
      headers: {
        Authorization: `Bearer ${TEST_PARTICIPANT_TOKEN}`
      }
    });
    
    console.log('✅ Participant eligibility:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Participant eligibility failed:');
    console.error('  Status:', error.response?.status);
    console.error('  Status Text:', error.response?.statusText);
    console.error('  Error Message:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test participant submissions
async function testParticipantSubmissions() {
  try {
    console.log('🧪 Testing participant submissions...');
    
    const response = await axios.get(`${BASE_URL}/api/submission-form/user-submissions/${TEST_HACKATHON_ID}`, {
      headers: {
        Authorization: `Bearer ${TEST_PARTICIPANT_TOKEN}`
      }
    });
    
    console.log('✅ Participant submissions:', {
      count: response.data.length,
      round0Submissions: response.data.filter(s => s.roundIndex === 0).length,
      round1Submissions: response.data.filter(s => s.roundIndex === 1).length,
      shortlistedSubmissions: response.data.filter(s => s.status === 'shortlisted').length
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Participant submissions failed:', error.response?.data || error.message);
    return null;
  }
}

// Test hackathon data for participant
async function testHackathonDataForParticipant() {
  try {
    console.log('🧪 Testing hackathon data for participant...');
    
    const response = await axios.get(`${BASE_URL}/api/hackathons/${TEST_HACKATHON_ID}`, {
      headers: {
        Authorization: `Bearer ${TEST_PARTICIPANT_TOKEN}`
      }
    });
    
    console.log('✅ Hackathon data for participant:', {
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
          roundCompleted: progress.roundCompleted
        });
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Hackathon data for participant failed:', error.response?.data || error.message);
    return null;
  }
}

// Main test function
async function testParticipantShortlisting() {
  console.log('🚀 Starting participant shortlisting tests...\n');
  
  // Test 1: Get hackathon data
  const hackathonData = await testHackathonDataForParticipant();
  
  // Test 2: Get participant submissions
  const submissions = await testParticipantSubmissions();
  
  // Test 3: Get participant shortlisting status
  const shortlistingStatus = await testParticipantShortlistingStatus();
  
  // Test 4: Get participant eligibility
  const eligibility = await testParticipantEligibility();
  
  console.log('\n📋 Participant Test Summary:');
  console.log('- Hackathon Data:', hackathonData ? '✅' : '❌');
  console.log('- Submissions:', submissions ? `${submissions.length} total` : 'Failed');
  console.log('- Shortlisting Status:', shortlistingStatus ? '✅' : '❌');
  console.log('- Eligibility:', eligibility ? '✅' : '❌');
  
  if (shortlistingStatus) {
    console.log('\n📊 Shortlisting Status Details:');
    console.log('- Total Rounds:', shortlistingStatus.totalRounds);
    console.log('- User Team:', shortlistingStatus.userTeam);
    console.log('- Shortlisting Status Keys:', Object.keys(shortlistingStatus.shortlistingStatus || {}));
    
    Object.entries(shortlistingStatus.shortlistingStatus || {}).forEach(([key, value]) => {
      console.log(`  ${key}:`, {
        isShortlisted: value.isShortlisted,
        shortlistingSource: value.shortlistingSource,
        roundIndex: value.roundIndex,
        nextRoundIndex: value.nextRoundIndex
      });
    });
  }
  
  if (eligibility) {
    console.log('\n📊 Eligibility Details:');
    console.log('- Eligible:', eligibility.eligible);
    console.log('- Shortlisted:', eligibility.shortlisted);
    console.log('- Message:', eligibility.message);
    console.log('- Round Started:', eligibility.roundStarted);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testParticipantShortlisting().catch(console.error);
}

module.exports = {
  testParticipantShortlistingStatus,
  testParticipantEligibility,
  testParticipantSubmissions,
  testHackathonDataForParticipant,
  testParticipantShortlisting
}; 