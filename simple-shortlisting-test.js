// Simple test to identify shortlisting issues
const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_HACKATHON_ID = '68883e9a075f6d9af98f7bea';
const TEST_ORGANIZER_TOKEN = 'your-organizer-token'; // Replace with actual token

// Simple shortlisting test
async function testShortlisting() {
  try {
    console.log('🧪 Testing shortlisting with minimal data...');
    
    // Test with minimal data
    const testData = {
      mode: 'topN',
      shortlistCount: 1
    };
    
    console.log('📊 Sending request with data:', testData);
    
    const response = await axios.post(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/0/shortlist`, testData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      },
      timeout: 30000 // 30 second timeout
    });
    
    console.log('✅ Shortlisting successful!');
    console.log('📊 Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Shortlisting failed!');
    console.error('📊 Error details:');
    console.error('  Status:', error.response?.status);
    console.error('  Status Text:', error.response?.statusText);
    console.error('  Error Message:', error.response?.data?.message || error.message);
    console.error('  Error Details:', error.response?.data?.error || 'No error details');
    console.error('  Stack Trace:', error.response?.data?.stack || 'No stack trace');
    
    // Log the full error response if available
    if (error.response?.data) {
      console.error('📊 Full error response:', JSON.stringify(error.response.data, null, 2));
    }
    
    return null;
  }
}

// Test server connectivity
async function testServerConnectivity() {
  try {
    console.log('🧪 Testing server connectivity...');
    
    const response = await axios.get(`${BASE_URL}/api/health`, { timeout: 5000 });
    console.log('✅ Server is running:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Server connectivity failed:', error.message);
    return false;
  }
}

// Test hackathon data
async function testHackathonData() {
  try {
    console.log('🧪 Testing hackathon data...');
    
    const response = await axios.get(`${BASE_URL}/api/hackathons/${TEST_HACKATHON_ID}`, {
      headers: {
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Hackathon data retrieved:', {
      title: response.data.title,
      rounds: response.data.rounds?.length || 0,
      organizer: response.data.organizer
    });
    return response.data;
  } catch (error) {
    console.error('❌ Hackathon data failed:', error.response?.data || error.message);
    return null;
  }
}

// Main test function
async function runSimpleTest() {
  console.log('🚀 Starting simple shortlisting test...\n');
  
  // Test 1: Server connectivity
  const serverOk = await testServerConnectivity();
  if (!serverOk) {
    console.log('❌ Server is not accessible');
    return;
  }
  
  // Test 2: Hackathon data
  const hackathonData = await testHackathonData();
  if (!hackathonData) {
    console.log('❌ Cannot access hackathon data');
    return;
  }
  
  // Test 3: Shortlisting
  const shortlistingResult = await testShortlisting();
  
  console.log('\n📋 Test Summary:');
  console.log('- Server:', serverOk ? '✅' : '❌');
  console.log('- Hackathon Data:', hackathonData ? '✅' : '❌');
  console.log('- Shortlisting:', shortlistingResult ? '✅' : '❌');
}

// Run test if this file is executed directly
if (require.main === module) {
  runSimpleTest().catch(console.error);
}

module.exports = {
  testShortlisting,
  testServerConnectivity,
  testHackathonData,
  runSimpleTest
}; 