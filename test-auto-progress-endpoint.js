// Test script to verify auto-progress endpoint
const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_HACKATHON_ID = '68883e9a075f6d9af98f7bea';
const TEST_ORGANIZER_TOKEN = 'your-organizer-token'; // Replace with actual token

// Test auto-progress endpoint
async function testAutoProgressEndpoint() {
  try {
    console.log('🧪 Testing auto-progress endpoint...');
    
    const response = await axios.post(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/0/auto-progress-round2`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Auto-progress response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Auto-progress endpoint failed:');
    console.error('  Status:', error.response?.status);
    console.error('  Status Text:', error.response?.statusText);
    console.error('  Error Message:', error.response?.data?.message || error.message);
    console.error('  Error Details:', error.response?.data?.error || 'No error details');
    return null;
  }
}

// Test hackathon rounds data
async function testHackathonRounds() {
  try {
    console.log('🧪 Testing hackathon rounds data...');
    
    const response = await axios.get(`${BASE_URL}/api/hackathons/${TEST_HACKATHON_ID}`, {
      headers: {
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Hackathon rounds data:', {
      title: response.data.title,
      rounds: response.data.rounds?.map((round, index) => ({
        index,
        name: round.name,
        startDate: round.startDate,
        endDate: round.endDate
      })) || [],
      roundProgress: response.data.roundProgress?.length || 0
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error testing hackathon rounds:', error.response?.data || error.message);
    return null;
  }
}

// Test shortlisted submissions
async function testShortlistedSubmissions() {
  try {
    console.log('🧪 Testing shortlisted submissions...');
    
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/0/shortlisted`, {
      headers: {
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Shortlisted submissions:', {
      count: response.data.length,
      submissions: response.data.map(s => ({
        id: s._id,
        projectTitle: s.projectTitle,
        status: s.status,
        shortlistedForRound: s.shortlistedForRound
      }))
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error testing shortlisted submissions:', error.response?.data || error.message);
    return null;
  }
}

// Main test function
async function runAutoProgressTests() {
  console.log('🚀 Starting auto-progress endpoint tests...\n');
  
  // Test 1: Get hackathon rounds data
  const hackathonData = await testHackathonRounds();
  
  if (hackathonData) {
    console.log(`📊 Hackathon has ${hackathonData.rounds?.length || 0} rounds`);
    console.log(`📊 Round progress entries: ${hackathonData.roundProgress?.length || 0}\n`);
  }
  
  // Test 2: Get shortlisted submissions
  const shortlistedData = await testShortlistedSubmissions();
  
  if (shortlistedData) {
    console.log(`📊 Shortlisted submissions: ${shortlistedData.length}\n`);
  }
  
  // Test 3: Test auto-progress endpoint
  const autoProgressResult = await testAutoProgressEndpoint();
  
  if (autoProgressResult) {
    console.log(`✅ Auto-progress result: ${autoProgressResult.progressed ? 'Progressed' : 'No progression'}`);
    if (autoProgressResult.progressed) {
      console.log(`📊 Progressed ${autoProgressResult.count} submissions`);
    }
  }
  
  console.log('\n✅ All auto-progress tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAutoProgressTests().catch(console.error);
}

module.exports = {
  testAutoProgressEndpoint,
  testHackathonRounds,
  testShortlistedSubmissions,
  runAutoProgressTests
}; 