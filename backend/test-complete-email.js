require('dotenv').config();
const nodemailer = require('nodemailer');
const { createWinnerEmailTemplate, createWinnerEmailText } = require('./templates/winnerEmailTemplate');

async function testCompleteEmail() {
  console.log('🧪 Testing Complete Email Flow...\n');
  
  try {
    // Check environment variables
    const mailUser = process.env.MAIL_USER || process.env.SMTP_USER;
    const mailPass = process.env.MAIL_PASS || process.env.SMTP_PASS;
    
    console.log('📧 Environment Variables:');
    console.log('MAIL_USER:', mailUser || 'NOT_SET');
    console.log('MAIL_PASS:', mailPass ? 'SET' : 'NOT_SET');
    
    if (!mailUser || !mailPass) {
      console.log('\n❌ Email credentials not configured!');
      return;
    }
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: mailUser,
        pass: mailPass
      }
    });
    
    console.log('\n🔍 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    
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
    
    console.log('\n📧 Generating email templates...');
    const htmlContent = createWinnerEmailTemplate(testWinnerData, testHackathonData, 3);
    const textContent = createWinnerEmailText(testWinnerData, testHackathonData, 3);
    
    console.log('✅ HTML template generated:', htmlContent.length, 'characters');
    console.log('✅ Text template generated:', textContent.length, 'characters');
    
    // Test sending email with templates
    console.log('\n📧 Sending test email with templates...');
    
    const testMailOptions = {
      from: `"${testHackathonData.title} Team" <${mailUser}>`,
      to: 'pre12po@gmail.com', // Your test email
      subject: `🏆 Congratulations! You're a Winner - ${testHackathonData.title}`,
      html: htmlContent,
      text: textContent
    };
    
    const result = await transporter.sendMail(testMailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 To:', result.accepted);
    
    console.log('\n🎉 Complete email flow is working perfectly!');
    console.log('✅ SMTP connection: Working');
    console.log('✅ Email templates: Working');
    console.log('✅ Email sending: Working');
    console.log('✅ Winner emails: Ready to use!');
    
  } catch (error) {
    console.error('\n❌ Complete email test failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Stack:', error.stack);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testCompleteEmail();
}

module.exports = { testCompleteEmail }; 