const express = require('express');
const router = express.Router();
const { sendWinnerEmail } = require('../services/emailService');

// Test email configuration endpoint
router.get('/test-email-config', async (req, res) => {
  try {
    const smtpConfigured = !!((process.env.SMTP_USER || process.env.MAIL_USER) && (process.env.SMTP_PASS || process.env.MAIL_PASS));
    
    res.status(200).json({
      configured: smtpConfigured,
      smtpHost: process.env.SMTP_HOST || process.env.MAIL_HOST || 'smtp.gmail.com',
      smtpPort: process.env.SMTP_PORT || process.env.MAIL_PORT || 587,
      smtpUser: process.env.SMTP_USER || process.env.MAIL_USER || 'NOT_SET',
      smtpPass: (process.env.SMTP_PASS || process.env.MAIL_PASS) ? 'SET' : 'NOT_SET'
    });
  } catch (error) {
    res.status(500).json({
      configured: false,
      error: error.message
    });
  }
});

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    const { recipientEmail } = req.body;
    
    if (!recipientEmail) {
      return res.status(400).json({ message: 'Recipient email is required' });
    }
    
    // Check SMTP configuration first
    const smtpConfigured = !!((process.env.SMTP_USER || process.env.MAIL_USER) && (process.env.SMTP_PASS || process.env.MAIL_PASS));
    if (!smtpConfigured) {
      return res.status(400).json({ 
        message: 'SMTP not configured. Please set SMTP_USER/SMTP_PASS or MAIL_USER/MAIL_PASS in .env file',
        smtpUser: process.env.SMTP_USER || process.env.MAIL_USER || 'NOT_SET',
        smtpPass: (process.env.SMTP_PASS || process.env.MAIL_PASS) ? 'SET' : 'NOT_SET'
      });
    }
    
    // Test data
    const testWinnerData = {
      _id: 'test-winner-id',
      projectTitle: 'Test Project',
      teamName: 'Test Team',
      leaderName: 'John Doe',
      pptScore: 8.5,
      projectScore: 9.0,
      combinedScore: 8.75
    };
    
    const testHackathonData = {
      _id: 'test-hackathon-id',
      title: 'Test Hackathon 2024',
      winners: [
        {
          _id: 'winner-1',
          projectTitle: 'First Place Project',
          teamName: 'Team Alpha',
          combinedScore: 9.5
        },
        {
          _id: 'winner-2',
          projectTitle: 'Second Place Project',
          teamName: 'Team Beta',
          combinedScore: 9.0
        }
      ]
    };
    
    console.log('🧪 Testing email to:', recipientEmail);
    console.log('🧪 SMTP Config:', {
      host: process.env.SMTP_HOST || process.env.MAIL_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || process.env.MAIL_PORT || 587,
      user: process.env.SMTP_USER || process.env.MAIL_USER,
      pass: (process.env.SMTP_PASS || process.env.MAIL_PASS) ? 'SET' : 'NOT_SET'
    });
    
    // Test transporter verification first
    const emailService = require('../services/emailService');
    const transporter = emailService.createTransporter();
    await transporter.verify();
    console.log('✅ Transporter verified successfully');
    
    const result = await sendWinnerEmail(testWinnerData, testHackathonData, 1, recipientEmail);
    
    res.status(200).json({
      message: 'Test email sent successfully',
      messageId: result.messageId,
      recipient: recipientEmail
    });
    
  } catch (error) {
    console.error('❌ Test email failed:', error);
    res.status(500).json({
      message: 'Failed to send test email',
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router; 