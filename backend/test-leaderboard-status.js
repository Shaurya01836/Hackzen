// Test script to verify leaderboard status
const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_HACKATHON_ID = '6885e475acc956ebb822e3ee'; // Test Shortlisting Hackathon
const TEST_ORGANIZER_TOKEN = 'your-organizer-token'; // Replace with actual organizer token

// Test leaderboard status
async function testLeaderboardStatus() {
  try {
    console.log('🧪 Testing leaderboard status...');
    
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/rounds/0/leaderboard`, {
      headers: {
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Leaderboard data:', {
      count: response.data.leaderboard?.length || 0,
      shortlistedCount: response.data.leaderboard?.filter(s => s.status === 'shortlisted').length || 0,
      summary: response.data.summary
    });
    
    // Show details of each leaderboard entry
    if (response.data.leaderboard) {
      response.data.leaderboard.forEach((entry, index) => {
        console.log(`  Leaderboard Entry ${index}:`, {
          id: entry._id,
          projectTitle: entry.projectTitle,
          status: entry.status,
          averageScore: entry.averageScore,
          scoreCount: entry.scoreCount,
          teamName: entry.teamName
        });
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Leaderboard failed:', error.response?.data || error.message);
    return null;
  }
}

// Test submissions directly
async function testSubmissionsStatus() {
  try {
    console.log('🧪 Testing submissions status...');
    
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/submissions`, {
      headers: {
        Authorization: `Bearer ${TEST_ORGANIZER_TOKEN}`
      }
    });
    
    console.log('✅ Submissions data:', {
      count: response.data.length,
      shortlistedSubmissions: response.data.filter(s => s.status === 'shortlisted').length,
      submittedSubmissions: response.data.filter(s => s.status === 'submitted').length
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
async function testLeaderboardStatus() {
  console.log('🚀 Starting leaderboard status tests...\n');
  
  // Test 1: Get submissions status
  const submissions = await testSubmissionsStatus();
  
  // Test 2: Get leaderboard status
  const leaderboard = await testLeaderboardStatus();
  
  console.log('\n📋 Test Summary:');
  console.log('- Submissions:', submissions ? `${submissions.length} total` : 'Failed');
  console.log('- Leaderboard:', leaderboard ? `${leaderboard.leaderboard?.length || 0} entries` : 'Failed');
  
  if (submissions && leaderboard) {
    console.log('\n📊 Status Analysis:');
    
    // Check if submission statuses match leaderboard statuses
    const submissionIds = submissions.map(s => s._id);
    const leaderboardIds = leaderboard.leaderboard?.map(l => l._id) || [];
    
    console.log('- Submission IDs:', submissionIds.length);
    console.log('- Leaderboard IDs:', leaderboardIds.length);
    
    // Find matching entries
    const matchingEntries = leaderboard.leaderboard?.filter(l => submissionIds.includes(l._id)) || [];
    console.log('- Matching entries:', matchingEntries.length);
    
    matchingEntries.forEach(entry => {
      const submission = submissions.find(s => s._id === entry._id);
      console.log(`  ${entry.projectTitle}:`, {
        submissionStatus: submission?.status,
        leaderboardStatus: entry.status,
        match: submission?.status === entry.status ? '✅' : '❌'
      });
    });
    
    // Check for shortlisted entries
    const shortlistedSubmissions = submissions.filter(s => s.status === 'shortlisted');
    const shortlistedLeaderboard = leaderboard.leaderboard?.filter(l => l.status === 'shortlisted') || [];
    
    console.log('\n🏆 Shortlisting Analysis:');
    console.log('- Shortlisted submissions:', shortlistedSubmissions.length);
    console.log('- Shortlisted in leaderboard:', shortlistedLeaderboard.length);
    
    shortlistedSubmissions.forEach(submission => {
      console.log(`  Shortlisted submission: ${submission.projectTitle} (${submission._id})`);
    });
    
    shortlistedLeaderboard.forEach(entry => {
      console.log(`  Shortlisted leaderboard entry: ${entry.projectTitle} (${entry._id})`);
    });
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testLeaderboardStatus().catch(console.error);
}

module.exports = {
  testLeaderboardStatus,
  testSubmissionsStatus
}; 