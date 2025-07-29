// Test script to verify shortlisting endpoint
const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_HACKATHON_ID = '68883e9a075f6d9af98f7bea'; // The hackathon ID from the error
const TEST_ORGANIZER_TOKEN = 'your-organizer-token'; // Replace with actual organizer token

// Test functions
async function testShortlistingEndpoint() {
  try {
    console.log('🧪 Testing shortlisting endpoint...');
    
    // Test data
    const testData = {
      mode: 'topN',
      shortlistCount: 3
    };
    
    console.log('📊 Test data:', testData);
    
    const response = await axios.post(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/0/shortlist`, testData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Shortlisting response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error testing shortlisting endpoint:', error.response?.data || error.message);
    console.error('❌ Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    return null;
  }
}

async function testHackathonData() {
  try {
    console.log('🧪 Testing hackathon data retrieval...');
    
    const response = await axios.get(`${BASE_URL}/api/hackathons/${TEST_HACKATHON_ID}`, {
      headers: {
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Hackathon data:', {
      title: response.data.title,
      rounds: response.data.rounds?.length || 0,
      roundProgress: response.data.roundProgress?.length || 0,
      organizer: response.data.organizer
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error testing hackathon data:', error.response?.data || error.message);
    return null;
  }
}

async function testSubmissionsData() {
  try {
    console.log('🧪 Testing submissions data...');
    
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/submissions`, {
      headers: {
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Submissions data:', {
      count: response.data.length,
      round0Submissions: response.data.filter(s => s.roundIndex === 0).length,
      round1Submissions: response.data.filter(s => s.roundIndex === 1).length
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Error testing submissions data:', error.response?.data || error.message);
    return null;
  }
}

// Main test function
async function runShortlistingTests() {
  console.log('🚀 Starting shortlisting endpoint tests...\n');
  
  // Test 1: Get hackathon data
  const hackathonData = await testHackathonData();
  
  if (hackathonData) {
    console.log(`📊 Hackathon has ${hackathonData.rounds?.length || 0} rounds`);
    console.log(`📊 Round progress entries: ${hackathonData.roundProgress?.length || 0}\n`);
  }
  
  // Test 2: Get submissions data
  const submissionsData = await testSubmissionsData();
  
  if (submissionsData) {
    console.log(`📊 Total submissions: ${submissionsData.length}`);
    console.log(`📊 Round 0 submissions: ${submissionsData.filter(s => s.roundIndex === 0).length}\n`);
  }
  
  // Test 3: Test shortlisting endpoint
  const shortlistingResult = await testShortlistingEndpoint();
  
  if (shortlistingResult) {
    console.log(`✅ Shortlisting successful: ${shortlistingResult.shortlistedSubmissions?.length || 0} submissions shortlisted`);
  }
  
  console.log('\n✅ All shortlisting tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runShortlistingTests().catch(console.error);
}

module.exports = {
  testShortlistingEndpoint,
  testHackathonData,
  testSubmissionsData,
  runShortlistingTests
}; 