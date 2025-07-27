require('dotenv').config();
const nodemailer = require('nodemailer');

async function testSimpleEmail() {
  console.log('🧪 Testing Simple Email...\n');
  
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
    
    // Test sending a simple email
    console.log('\n📧 Sending test email...');
    
    const testMailOptions = {
      from: `"Test" <${mailUser}>`,
      to: 'pre12po@gmail.com', // Your test email
      subject: '🧪 Test Email - Working!',
      text: 'This is a test email to verify the email service is working correctly.',
      html: `
        <h2>🧪 Test Email</h2>
        <p>This is a test email to verify the email service is working correctly.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Status:</strong> ✅ Email service is working!</p>
      `
    };
    
    const result = await transporter.sendMail(testMailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 To:', result.accepted);
    
    console.log('\n🎉 Email configuration is working perfectly!');
    
  } catch (error) {
    console.error('\n❌ Email test failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Stack:', error.stack);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testSimpleEmail();
}

module.exports = { testSimpleEmail }; 