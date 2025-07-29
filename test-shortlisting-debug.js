// Debug script to test shortlisting functionality
const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_HACKATHON_ID = '68883e9a075f6d9af98f7bea';
const TEST_ORGANIZER_TOKEN = 'your-organizer-token'; // Replace with actual token

// Test shortlisting endpoint
async function testShortlisting() {
  try {
    console.log('🧪 Testing shortlisting endpoint...');
    
    const testData = {
      mode: 'topN',
      shortlistCount: 2
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
    console.error('❌ Shortlisting failed:');
    console.error('  Status:', error.response?.status);
    console.error('  Status Text:', error.response?.statusText);
    console.error('  Error Message:', error.response?.data?.message || error.message);
    console.error('  Error Details:', error.response?.data?.error || 'No error details');
    return null;
  }
}

// Test leaderboard endpoint
async function testLeaderboard() {
  try {
    console.log('🧪 Testing leaderboard endpoint...');
    
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/0/leaderboard`, {
      headers: {
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Leaderboard response:', {
      hackathon: response.data.hackathon?.title,
      leaderboardCount: response.data.leaderboard?.length || 0,
      summary: response.data.summary
    });
    
    if (response.data.leaderboard) {
      response.data.leaderboard.forEach((entry, index) => {
        console.log(`  Entry ${index}:`, {
          projectTitle: entry.projectTitle,
          averageScore: entry.averageScore,
          scoreCount: entry.scoreCount,
          status: entry.status
        });
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Leaderboard failed:', error.response?.data || error.message);
    return null;
  }
}

// Test submissions endpoint
async function testSubmissions() {
  try {
    console.log('🧪 Testing submissions endpoint...');
    
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/submissions`, {
      headers: {
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Submissions response:', {
      count: response.data.length,
      round0Count: response.data.filter(s => s.roundIndex === 0).length,
      round1Count: response.data.filter(s => s.roundIndex === 1).length,
      shortlistedCount: response.data.filter(s => s.status === 'shortlisted').length
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Submissions failed:', error.response?.data || error.message);
    return null;
  }
}

// Test scores endpoint
async function testScores() {
  try {
    console.log('🧪 Testing scores endpoint...');
    
    const response = await axios.get(`${BASE_URL}/api/scores`, {
      headers: {
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Scores response:', {
      count: response.data.length,
      scores: response.data.map(s => ({
        submission: s.submission,
        judge: s.judge,
        totalScore: s.totalScore,
        roundIndex: s.roundIndex
      }))
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Scores failed:', error.response?.data || error.message);
    return null;
  }
}

// Main debug function
async function debugShortlisting() {
  console.log('🚀 Starting shortlisting debug...\n');
  
  // Test 1: Get submissions
  const submissions = await testSubmissions();
  
  // Test 2: Get scores
  const scores = await testScores();
  
  // Test 3: Get leaderboard
  const leaderboard = await testLeaderboard();
  
  // Test 4: Test shortlisting
  const shortlistingResult = await testShortlisting();
  
  console.log('\n📋 Debug Summary:');
  console.log('- Submissions:', submissions ? `${submissions.length} total` : 'Failed');
  console.log('- Scores:', scores ? `${scores.length} total` : 'Failed');
  console.log('- Leaderboard:', leaderboard ? `${leaderboard.leaderboard?.length || 0} entries` : 'Failed');
  console.log('- Shortlisting:', shortlistingResult ? 'Success' : 'Failed');
}

// Run debug if this file is executed directly
if (require.main === module) {
  debugShortlisting().catch(console.error);
}

module.exports = {
  testShortlisting,
  testLeaderboard,
  testSubmissions,
  testScores,
  debugShortlisting
}; 