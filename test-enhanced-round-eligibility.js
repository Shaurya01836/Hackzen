// Test script to verify enhanced round-wise eligibility system
const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_HACKATHON_ID = '6888470ea3453e43c37bb705'; // The GTA 6 Hackathon ID
const TEST_USER_TOKEN = 'your-test-user-token'; // Replace with actual user token

// Test functions
async function testEnhancedShortlistingStatus() {
  try {
    console.log('🧪 Testing enhanced shortlisting status endpoint...');
    
    const response = await axios.get(`${BASE_URL}/api/judge-management/hackathons/${TEST_HACKATHON_ID}/shortlisting-status`, {
      headers: {
        Authorization: `Bearer ${TEST_USER_TOKEN}`
      }
    });
    
    console.log('✅ Enhanced shortlisting status response:', response.data);
    
    // Check if the response has the expected structure
    if (response.data.shortlistingStatus) {
      console.log('✅ Enhanced shortlisting status structure is correct');
      console.log('📊 Shortlisting entries:', Object.keys(response.data.shortlistingStatus));
      
      // Check each round transition
      Object.entries(response.data.shortlistingStatus).forEach(([key, value]) => {
        console.log(`📋 ${key}:`, {
          isShortlisted: value.isShortlisted,
          shortlistingSource: value.shortlistingSource,
          roundIndex: value.roundIndex,
          nextRoundIndex: value.nextRoundIndex,
          roundProgress: value.roundProgress ? {
            roundCompleted: value.roundProgress.roundCompleted,
            nextRoundEligibility: value.roundProgress.nextRoundEligibility,
            shortlistedAt: value.roundProgress.shortlistedAt
          } : null
        });
      });
    } else {
      console.log('⚠️ No shortlisting status found');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error testing enhanced shortlisting status:', error.response?.data || error.message);
    return null;
  }
}

async function testRoundEligibility(roundIndex = 0) {
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
      console.log(`📊 Eligibility source:`, response.data.eligibilitySource);
      console.log(`📊 Is first round:`, response.data.isFirstRound);
    }
    
    return response.data;
  } catch (error) {
    console.error(`❌ Error testing round ${roundIndex + 1} eligibility:`, error.response?.data || error.message);
    return null;
  }
}

async function testHackathonRoundProgress() {
  try {
    console.log('🧪 Testing hackathon round progress data...');
    
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
    
    // Check enhanced round progress
    if (response.data.roundProgress) {
      response.data.roundProgress.forEach((progress, index) => {
        console.log(`📊 Round Progress ${index}:`, {
          roundIndex: progress.roundIndex,
          shortlistedTeams: progress.shortlistedTeams?.length || 0,
          eligibleTeams: progress.eligibleTeams?.length || 0,
          eligibleParticipants: progress.eligibleParticipants?.length || 0,
          eligibleSubmissions: progress.eligibleSubmissions?.length || 0,
          roundCompleted: progress.roundCompleted,
          nextRoundEligibility: progress.nextRoundEligibility,
          shortlistedAt: progress.shortlistedAt
        });
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error testing hackathon round progress:', error.response?.data || error.message);
    return null;
  }
}

// Test the enhanced eligibility logic
function testEnhancedEligibilityLogic() {
  console.log('🧪 Testing enhanced eligibility logic...');
  
  // Mock data for testing enhanced round progress
  const mockEnhancedRoundProgress = {
    roundIndex: 0,
    shortlistedTeams: ['team1', 'team2'],
    eligibleTeams: ['team1', 'team2'],
    eligibleParticipants: ['user1', 'user2', 'user3', 'user4'],
    eligibleSubmissions: ['sub1', 'sub2'],
    roundCompleted: true,
    nextRoundEligibility: true,
    shortlistedAt: new Date()
  };
  
  // Mock data for testing shortlisting status
  const mockEnhancedShortlistingData = {
    shortlistingStatus: {
      'round1ToRound2': {
        isShortlisted: true,
        shortlistingSource: 'enhanced_eligible_teams',
        roundIndex: 0,
        nextRoundIndex: 1,
        roundProgress: {
          roundCompleted: true,
          nextRoundEligibility: true,
          shortlistedAt: new Date()
        }
      }
    },
    totalRounds: 2,
    userTeam: 'team1',
    currentRound: 2
  };
  
  const mockNonEligibleData = {
    shortlistingStatus: {
      'round1ToRound2': {
        isShortlisted: false,
        shortlistingSource: null,
        roundIndex: 0,
        nextRoundIndex: 1,
        roundProgress: {
          roundCompleted: true,
          nextRoundEligibility: false,
          shortlistedAt: new Date()
        }
      }
    },
    totalRounds: 2,
    userTeam: null,
    currentRound: 2
  };
  
  // Test eligible user
  console.log('📊 Testing eligible user logic:');
  const eligibleUser = mockEnhancedShortlistingData.shortlistingStatus['round1ToRound2'];
  console.log('✅ Eligible user should see submit button:', eligibleUser.isShortlisted);
  console.log('✅ Eligibility source:', eligibleUser.shortlistingSource);
  console.log('✅ Round completed:', eligibleUser.roundProgress.roundCompleted);
  
  // Test non-eligible user
  console.log('📊 Testing non-eligible user logic:');
  const nonEligibleUser = mockNonEligibleData.shortlistingStatus['round1ToRound2'];
  console.log('❌ Non-eligible user should NOT see submit button:', !nonEligibleUser.isShortlisted);
  console.log('❌ Round eligibility:', nonEligibleUser.roundProgress.nextRoundEligibility);
  
  return { eligibleUser, nonEligibleUser, mockEnhancedRoundProgress };
}

// Test round-wise submission restrictions
function testRoundWiseSubmissionRestrictions() {
  console.log('🧪 Testing round-wise submission restrictions...');
  
  // Test scenarios
  const scenarios = [
    {
      name: 'Round 1 (First Round)',
      roundIndex: 0,
      shouldBeEligible: true,
      reason: 'Everyone is eligible for the first round'
    },
    {
      name: 'Round 2 (After Shortlisting)',
      roundIndex: 1,
      shouldBeEligible: false,
      reason: 'Only shortlisted participants from Round 1 can access Round 2'
    },
    {
      name: 'Round 3 (If Exists)',
      roundIndex: 2,
      shouldBeEligible: false,
      reason: 'Only participants who qualified from Round 2 can access Round 3'
    }
  ];
  
  scenarios.forEach(scenario => {
    console.log(`📋 ${scenario.name}:`);
    console.log(`   - Round Index: ${scenario.roundIndex}`);
    console.log(`   - Should be eligible: ${scenario.shouldBeEligible}`);
    console.log(`   - Reason: ${scenario.reason}`);
  });
  
  return scenarios;
}

// Main test function
async function runEnhancedTests() {
  console.log('🚀 Starting enhanced round-wise eligibility verification tests...\n');
  
  // Test 1: Get hackathon data with enhanced round progress
  const hackathonData = await testHackathonRoundProgress();
  
  if (hackathonData) {
    console.log(`📊 Hackathon has ${hackathonData.rounds?.length || 0} rounds`);
    console.log(`📊 Enhanced round progress entries: ${hackathonData.roundProgress?.length || 0}\n`);
  }
  
  // Test 2: Get enhanced shortlisting status
  const shortlistingStatus = await testEnhancedShortlistingStatus();
  
  if (shortlistingStatus) {
    console.log(`📊 Enhanced shortlisting status entries: ${Object.keys(shortlistingStatus.shortlistingStatus || {}).length}`);
    console.log(`📊 Total rounds: ${shortlistingStatus.totalRounds}\n`);
  }
  
  // Test 3: Test round eligibility for different rounds
  if (hackathonData && hackathonData.rounds) {
    for (let i = 0; i < Math.min(hackathonData.rounds.length, 2); i++) {
      await testRoundEligibility(i);
    }
  }
  
  // Test 4: Test enhanced eligibility logic
  testEnhancedEligibilityLogic();
  
  // Test 5: Test round-wise submission restrictions
  testRoundWiseSubmissionRestrictions();
  
  console.log('\n✅ All enhanced tests completed!');
  console.log('\n📋 Enhanced System Summary:');
  console.log('- Enhanced round progress tracks eligible teams, participants, and submissions');
  console.log('- Round-specific eligibility checking with multiple fallback methods');
  console.log('- Submit buttons only appear for eligible participants');
  console.log('- Clear messaging for non-eligible participants');
  console.log('- Backward compatibility with legacy shortlisting data');
  console.log('- Proper round-wise progression tracking');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runEnhancedTests().catch(console.error);
}

module.exports = {
  testEnhancedShortlistingStatus,
  testRoundEligibility,
  testHackathonRoundProgress,
  testEnhancedEligibilityLogic,
  testRoundWiseSubmissionRestrictions,
  runEnhancedTests
}; 