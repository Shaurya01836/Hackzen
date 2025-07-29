// Test script to verify shortlisting functionality
const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_HACKATHON_ID = 'your-test-hackathon-id'; // Replace with actual hackathon ID
const TEST_USER_TOKEN = 'your-test-user-token'; // Replace with actual user token

// Test functions
async function testShortlistingStatus() {
  try {
    console.log('🧪 Testing shortlisting status endpoint...');
    
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/shortlisting-status`, {
      headers: {
        Authorization: `Bearer ${TEST_USER_TOKEN}`
      }
    });
    
    console.log('✅ Shortlisting status response:', response.data);
    
    // Check if the response has the expected structure
    if (response.data.shortlistingStatus) {
      console.log('✅ Shortlisting status structure is correct');
      console.log('📊 Shortlisting entries:', Object.keys(response.data.shortlistingStatus));
      
      // Check each round transition
      Object.entries(response.data.shortlistingStatus).forEach(([key, value]) => {
        console.log(`📋 ${key}:`, {
          isShortlisted: value.isShortlisted,
          shortlistingSource: value.shortlistingSource,
          roundIndex: value.roundIndex,
          nextRoundIndex: value.nextRoundIndex
        });
      });
    } else {
      console.log('⚠️ No shortlisting status found');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error testing shortlisting status:', error.response?.data || error.message);
    return null;
  }
}

async function testRoundEligibility(roundIndex = 1) {
  try {
    console.log(`🧪 Testing round ${roundIndex + 1} eligibility...`);
    
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/${roundIndex}/eligibility`, {
      headers: {
        Authorization: `Bearer ${TEST_USER_TOKEN}`
      }
    });
    
    console.log(`✅ Round ${roundIndex + 1} eligibility response:`, response.data);
    
    // Check eligibility logic
    if (response.data.eligible !== undefined) {
      console.log(`📊 Eligible for Round ${roundIndex + 1}:`, response.data.eligible);
      console.log(`📊 Shortlisted:`, response.data.shortlisted);
      console.log(`📊 Round started:`, response.data.roundStarted);
    }
    
    return response.data;
  } catch (error) {
    console.error(`❌ Error testing round ${roundIndex + 1} eligibility:`, error.response?.data || error.message);
    return null;
  }
}

async function testHackathonData() {
  try {
    console.log('🧪 Testing hackathon data retrieval...');
    
    const response = await axios.get(`${BASE_URL}/api/hackathons/${TEST_HACKATHON_ID}`, {
      headers: {
        Authorization: `Bearer ${TEST_USER_TOKEN}`
      }
    });
    
    console.log('✅ Hackathon data:', {
      title: response.data.title,
      rounds: response.data.rounds?.length || 0,
      roundProgress: response.data.roundProgress?.length || 0
    });
    
    // Check rounds structure
    if (response.data.rounds) {
      response.data.rounds.forEach((round, index) => {
        console.log(`📋 Round ${index + 1}:`, {
          name: round.name,
          type: round.type,
          startDate: round.startDate,
          endDate: round.endDate
        });
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error testing hackathon data:', error.response?.data || error.message);
    return null;
  }
}

// Test the shortlisting logic
function testShortlistingLogic() {
  console.log('🧪 Testing shortlisting logic...');
  
  // Mock data for testing
  const mockShortlistingData = {
    shortlistingStatus: {
      'round1ToRound2': {
        isShortlisted: true,
        shortlistingSource: 'submission_status',
        roundIndex: 0,
        nextRoundIndex: 1
      }
    },
    totalRounds: 2,
    userTeam: null
  };
  
  const mockNonShortlistedData = {
    shortlistingStatus: {
      'round1ToRound2': {
        isShortlisted: false,
        shortlistingSource: null,
        roundIndex: 0,
        nextRoundIndex: 1
      }
    },
    totalRounds: 2,
    userTeam: null
  };
  
  // Test shortlisted user
  console.log('📊 Testing shortlisted user logic:');
  const shortlistedUser = mockShortlistingData.shortlistingStatus['round1ToRound2'];
  console.log('✅ Shortlisted user should see submit button:', shortlistedUser.isShortlisted);
  
  // Test non-shortlisted user
  console.log('📊 Testing non-shortlisted user logic:');
  const nonShortlistedUser = mockNonShortlistedData.shortlistingStatus['round1ToRound2'];
  console.log('❌ Non-shortlisted user should NOT see submit button:', !nonShortlistedUser.isShortlisted);
  
  return { shortlistedUser, nonShortlistedUser };
}

// Main test function
async function runTests() {
  console.log('🚀 Starting shortlisting fix verification tests...\n');
  
  // Test 1: Get hackathon data
  const hackathonData = await testHackathonData();
  
  if (hackathonData) {
    console.log(`📊 Hackathon has ${hackathonData.rounds?.length || 0} rounds`);
    console.log(`📊 Round progress entries: ${hackathonData.roundProgress?.length || 0}\n`);
  }
  
  // Test 2: Get shortlisting status
  const shortlistingStatus = await testShortlistingStatus();
  
  if (shortlistingStatus) {
    console.log(`📊 Shortlisting status entries: ${Object.keys(shortlistingStatus.shortlistingStatus || {}).length}`);
    console.log(`📊 Total rounds: ${shortlistingStatus.totalRounds}\n`);
  }
  
  // Test 3: Test round eligibility for different rounds
  if (hackathonData && hackathonData.rounds) {
    for (let i = 0; i < Math.min(hackathonData.rounds.length - 1, 2); i++) {
      await testRoundEligibility(i);
    }
  }
  
  // Test 4: Test shortlisting logic
  testShortlistingLogic();
  
  console.log('\n✅ All tests completed!');
  console.log('\n📋 Summary:');
  console.log('- Shortlisting status endpoint should return detailed round-specific data');
  console.log('- Frontend should check round-specific shortlisting status');
  console.log('- Submit button should only appear for shortlisted participants');
  console.log('- Non-shortlisted participants should see "Not Shortlisted" message');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testShortlistingStatus,
  testRoundEligibility,
  testHackathonData,
  testShortlistingLogic,
  runTests
}; 