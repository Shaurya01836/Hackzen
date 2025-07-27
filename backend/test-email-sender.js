require('dotenv').config();
const mongoose = require('mongoose');
const Submission = require('./model/SubmissionModel');
const Hackathon = require('./model/HackathonModel');

async function testEmailSender() {
  console.log('🧪 Testing Email Sender Functionality...\n');
  
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon');
    console.log('✅ Connected to database');
    
    // Test data
    const testHackathonId = '68862b03c6e73b87fb6c0aee'; // Use your actual hackathon ID
    
    // Check current winners
    const currentWinners = await Submission.find({
      hackathonId: testHackathonId,
      roundIndex: 1,
      status: 'winner'
    }).populate('teamId', 'name members')
      .populate('submittedBy', 'name email')
      .populate('projectId', 'title')
      .lean();
    
    console.log('📊 Current winners:', currentWinners.length);
    
    if (currentWinners.length === 0) {
      console.log('❌ No winners found. Please assign winners first.');
      return;
    }
    
    // Check shortlisted participants
    const shortlistedParticipants = await Submission.find({
      hackathonId: testHackathonId,
      roundIndex: 1,
      status: 'shortlisted'
    }).populate('teamId', 'name members')
      .populate('submittedBy', 'name email')
      .populate('projectId', 'title')
      .lean();
    
    console.log('📊 Shortlisted participants:', shortlistedParticipants.length);
    
    // Prepare winners data for email
    const winnersForEmail = currentWinners.map((winner, index) => ({
      _id: winner._id,
      projectTitle: winner.projectId?.title || winner.teamName || 'Untitled Project',
      teamName: winner.teamName || winner.teamId?.name || 'No Team',
      leaderName: winner.submittedBy?.name || winner.submittedBy?.email || 'Unknown',
      pptScore: winner.pptScore || 0,
      projectScore: winner.projectScore || 0,
      combinedScore: winner.combinedScore || 0,
      position: index + 1
    }));
    
    console.log('📧 Prepared winners for email:', winnersForEmail.length);
    winnersForEmail.forEach((winner, index) => {
      console.log(`${index + 1}. ${winner.teamName} - ${winner.projectTitle} (Score: ${winner.combinedScore}/10)`);
    });
    
    // Check email configuration
    const smtpConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
    console.log('\n📧 Email Configuration:');
    console.log(`SMTP Configured: ${smtpConfigured ? '✅ Yes' : '❌ No'}`);
    console.log(`SMTP Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}`);
    console.log(`SMTP Port: ${process.env.SMTP_PORT || 587}`);
    console.log(`SMTP User: ${process.env.SMTP_USER || 'NOT_SET'}`);
    console.log(`SMTP Pass: ${process.env.SMTP_PASS ? 'SET' : 'NOT_SET'}`);
    
    if (!smtpConfigured) {
      console.log('\n❌ Email configuration incomplete. Please set SMTP_USER and SMTP_PASS in .env file');
      return;
    }
    
    // Test email service
    console.log('\n🧪 Testing email service...');
    const emailService = require('./services/emailService');
    
    // Create dummy hackathon data
    const hackathonData = {
      title: 'Test Hackathon',
      winners: winnersForEmail
    };
    
    // Test winner email sending
    console.log('📧 Testing winner email sending...');
    const emailResult = await emailService.sendBulkWinnerEmails(winnersForEmail, hackathonData);
    console.log('✅ Winner emails result:', emailResult);
    
    // Test shortlisted email sending
    if (shortlistedParticipants.length > 0) {
      console.log('📧 Testing shortlisted email sending...');
      const shortlistedForEmail = shortlistedParticipants.map(participant => ({
        _id: participant._id,
        projectTitle: participant.projectId?.title || participant.teamName || 'Untitled Project',
        teamName: participant.teamName || participant.teamId?.name || 'No Team',
        leaderName: participant.submittedBy?.name || participant.submittedBy?.email || 'Unknown',
        pptScore: participant.pptScore || 0,
        projectScore: participant.projectScore || 0,
        combinedScore: participant.combinedScore || 0
      }));
      
      const shortlistedEmailResult = await emailService.sendBulkShortlistedEmails(
        shortlistedForEmail, 
        hackathonData, 
        winnersForEmail
      );
      console.log('✅ Shortlisted emails result:', shortlistedEmailResult);
    }
    
    console.log('\n✅ Email sender test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testEmailSender();
}

module.exports = { testEmailSender }; 