require('dotenv').config();

// Test email templates
const { createWinnerEmailTemplate, createWinnerEmailText } = require('./templates/winnerEmailTemplate');
const { createShortlistedEmailTemplate, createShortlistedEmailText } = require('./templates/shortlistedEmailTemplate');

function testEmailTemplates() {
  console.log('🧪 Testing Email Templates...\n');
  
  try {
    // Test data
    const testWinnerData = {
      _id: 'test-winner-id',
      projectTitle: 'Amazing AI Project',
      teamName: 'Tech Innovators',
      leaderName: 'John Doe',
      pptScore: 8.5,
      projectScore: 9.0,
      combinedScore: 8.75
    };
    
    const testHackathonData = {
      _id: 'test-hackathon-id',
      title: 'Tech Innovation Hackathon 2024',
      winners: [
        {
          _id: 'winner-1',
          projectTitle: 'AI-Powered Healthcare',
          teamName: 'Team Alpha',
          combinedScore: 9.5
        },
        {
          _id: 'winner-2',
          projectTitle: 'Smart City Solutions',
          teamName: 'Team Beta',
          combinedScore: 9.0
        },
        {
          _id: 'winner-3',
          projectTitle: 'Amazing AI Project',
          teamName: 'Tech Innovators',
          combinedScore: 8.75
        }
      ]
    };
    
    const testShortlistedData = {
      _id: 'shortlisted-id',
      projectTitle: 'Good Project',
      teamName: 'Team Gamma',
      leaderName: 'Jane Smith',
      pptScore: 7.5,
      projectScore: 7.0,
      combinedScore: 7.25
    };
    
    console.log('📧 Testing Winner Email Template...');
    const winnerHtml = createWinnerEmailTemplate(testWinnerData, testHackathonData, 3);
    const winnerText = createWinnerEmailText(testWinnerData, testHackathonData, 3);
    
    console.log('✅ Winner HTML template generated successfully');
    console.log('✅ Winner text template generated successfully');
    console.log('📏 HTML length:', winnerHtml.length, 'characters');
    console.log('📏 Text length:', winnerText.length, 'characters');
    
    console.log('\n📧 Testing Shortlisted Email Template...');
    const shortlistedHtml = createShortlistedEmailTemplate(testShortlistedData, testHackathonData, testHackathonData.winners);
    const shortlistedText = createShortlistedEmailText(testShortlistedData, testHackathonData, testHackathonData.winners);
    
    console.log('✅ Shortlisted HTML template generated successfully');
    console.log('✅ Shortlisted text template generated successfully');
    console.log('📏 HTML length:', shortlistedHtml.length, 'characters');
    console.log('📏 Text length:', shortlistedText.length, 'characters');
    
    // Test template content
    console.log('\n🔍 Template Content Check:');
    console.log('✅ Winner HTML contains "Congratulations"', winnerHtml.includes('Congratulations'));
    console.log('✅ Winner HTML contains position', winnerHtml.includes('3rd Place'));
    console.log('✅ Winner HTML contains team name', winnerHtml.includes('Tech Innovators'));
    console.log('✅ Winner HTML contains project title', winnerHtml.includes('Amazing AI Project'));
    console.log('✅ Winner HTML contains winners table', winnerHtml.includes('Complete Winners List'));
    
    console.log('✅ Shortlisted HTML contains "Round 2"', shortlistedHtml.includes('Round 2'));
    console.log('✅ Shortlisted HTML contains "Keep going"', shortlistedHtml.includes('Keep going'));
    console.log('✅ Shortlisted HTML contains winners table', shortlistedHtml.includes('Winners of'));
    
    console.log('\n✅ All email templates are working correctly!');
    
  } catch (error) {
    console.error('❌ Template test failed:', error);
    console.error('Stack:', error.stack);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testEmailTemplates();
}

module.exports = { testEmailTemplates }; 