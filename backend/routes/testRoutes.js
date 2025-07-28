const express = require('express');
const router = express.Router();
const { protect, isOrganizerOrAdmin } = require('../middleware/authMiddleware');
const emailService = require('../services/emailService');

// Test email configuration endpoint
router.get('/test-email-config', protect, isOrganizerOrAdmin, async (req, res) => {
  try {
    // Check if SMTP is configured
    const smtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS) || 
                          !!(process.env.MAIL_USER && process.env.MAIL_PASS);
    
    res.json({
      configured: smtpConfigured,
      testEmail: process.env.TEST_EMAIL || '',
      smtpHost: process.env.SMTP_HOST || process.env.MAIL_HOST || 'smtp.gmail.com',
      smtpPort: process.env.SMTP_PORT || process.env.MAIL_PORT || 587
    });
  } catch (error) {
    console.error('Error checking email configuration:', error);
    res.status(500).json({ 
      configured: false, 
      error: 'Failed to check email configuration' 
    });
  }
});

// Test email sending endpoint
router.post('/test-email', protect, isOrganizerOrAdmin, async (req, res) => {
  try {
    const { recipientEmail } = req.body;
    
    if (!recipientEmail) {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    // Check if SMTP is configured
    const smtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS) || 
                          !!(process.env.MAIL_USER && process.env.MAIL_PASS);
    
    if (!smtpConfigured) {
      return res.status(400).json({ 
        error: 'SMTP not configured. Please set SMTP_USER and SMTP_PASS environment variables.' 
      });
    }

    // Create test email data
    const testData = {
      winnerData: {
        _id: 'test-winner-id',
        projectTitle: 'Test Project',
        teamName: 'Test Team',
        leaderName: 'Test Leader',
        pptScore: 8.5,
        projectScore: 9.0,
        combinedScore: 8.75
      },
      hackathonData: {
        title: 'Test Hackathon',
        winners: [
          {
            _id: 'test-winner-1',
            projectTitle: 'Test Project 1',
            teamName: 'Test Team 1',
            combinedScore: 9.0,
            position: 1
          },
          {
            _id: 'test-winner-2',
            projectTitle: 'Test Project 2',
            teamName: 'Test Team 2',
            combinedScore: 8.5,
            position: 2
          }
        ]
      },
      position: 1
    };

    // Send test email
    const result = await emailService.sendWinnerEmail(
      testData.winnerData,
      testData.hackathonData,
      testData.position,
      recipientEmail
    );

    res.json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ 
      error: 'Failed to send test email',
      details: error.message 
    });
  }
});

module.exports = router; 