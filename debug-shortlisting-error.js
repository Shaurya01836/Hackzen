// Debug script to identify shortlisting error
const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_HACKATHON_ID = '68883e9a075f6d9af98f7bea';
const TEST_ORGANIZER_TOKEN = 'your-organizer-token'; // Replace with actual token

// Test server connectivity
async function testServerConnectivity() {
  try {
    console.log('🧪 Testing server connectivity...');
    
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Server is running:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Server connectivity test failed:', error.message);
    return false;
  }
}

// Test hackathon endpoint
async function testHackathonEndpoint() {
  try {
    console.log('🧪 Testing hackathon endpoint...');
    
    const response = await axios.get(`${BASE_URL}/api/hackathons/${TEST_HACKATHON_ID}`, {
      headers: {
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Hackathon endpoint working:', {
      title: response.data.title,
      rounds: response.data.rounds?.length || 0,
      organizer: response.data.organizer
    });
    return true;
  } catch (error) {
    console.error('❌ Hackathon endpoint failed:', error.response?.data || error.message);
    return false;
  }
}

// Test submissions endpoint
async function testSubmissionsEndpoint() {
  try {
    console.log('🧪 Testing submissions endpoint...');
    
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/submissions`, {
      headers: {
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Submissions endpoint working:', {
      count: response.data.length,
      round0Count: response.data.filter(s => s.roundIndex === 0).length
    });
    return true;
  } catch (error) {
    console.error('❌ Submissions endpoint failed:', error.response?.data || error.message);
    return false;
  }
}

// Test shortlisting endpoint with minimal data
async function testShortlistingEndpoint() {
  try {
    console.log('🧪 Testing shortlisting endpoint with minimal data...');
    
    const testData = {
      mode: 'topN',
      shortlistCount: 1
    };
    
    const response = await axios.post(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/0/shortlist`, testData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Shortlisting endpoint working:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Shortlisting endpoint failed:');
    console.error('  Status:', error.response?.status);
    console.error('  Status Text:', error.response?.statusText);
    console.error('  Error Message:', error.response?.data?.message || error.message);
    console.error('  Error Details:', error.response?.data?.error || 'No error details');
    console.error('  Stack Trace:', error.response?.data?.stack || 'No stack trace');
    return false;
  }
}

// Test database models
async function testDatabaseModels() {
  try {
    console.log('🧪 Testing database models...');
    
    // Test if we can access the models
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/debug-models`, {
      headers: {
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Database models working:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Database models test failed:', error.response?.data || error.message);
    return false;
  }
}

// Main debugging function
async function debugShortlistingError() {
  console.log('🚀 Starting shortlisting error debugging...\n');
  
  // Test 1: Server connectivity
  const serverOk = await testServerConnectivity();
  if (!serverOk) {
    console.log('❌ Server is not running or not accessible');
    return;
  }
  
  // Test 2: Hackathon endpoint
  const hackathonOk = await testHackathonEndpoint();
  if (!hackathonOk) {
    console.log('❌ Hackathon endpoint is not working');
    return;
  }
  
  // Test 3: Submissions endpoint
  const submissionsOk = await testSubmissionsEndpoint();
  if (!submissionsOk) {
    console.log('❌ Submissions endpoint is not working');
    return;
  }
  
  // Test 4: Database models (if endpoint exists)
  await testDatabaseModels();
  
  // Test 5: Shortlisting endpoint
  const shortlistingOk = await testShortlistingEndpoint();
  if (!shortlistingOk) {
    console.log('❌ Shortlisting endpoint is failing - this is the issue!');
  } else {
    console.log('✅ All endpoints are working correctly');
  }
  
  console.log('\n📋 Debugging Summary:');
  console.log('- Server connectivity:', serverOk ? '✅' : '❌');
  console.log('- Hackathon endpoint:', hackathonOk ? '✅' : '❌');
  console.log('- Submissions endpoint:', submissionsOk ? '✅' : '❌');
  console.log('- Shortlisting endpoint:', shortlistingOk ? '✅' : '❌');
}

// Run debugging if this file is executed directly
if (require.main === module) {
  debugShortlistingError().catch(console.error);
}

module.exports = {
  testServerConnectivity,
  testHackathonEndpoint,
  testSubmissionsEndpoint,
  testShortlistingEndpoint,
  testDatabaseModels,
  debugShortlistingError
}; 