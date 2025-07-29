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
    return response.data;
  } catch (error) {
    console.error('❌ Error testing hackathon data:', error.response?.data || error.message);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting dynamic rounds functionality tests...\n');
  
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
  
  console.log('✅ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testShortlistingStatus,
  testRoundEligibility,
  testHackathonData,
  runTests
}; 