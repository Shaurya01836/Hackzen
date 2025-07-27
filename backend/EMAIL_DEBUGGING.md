# Email Debugging Guide

This guide helps you troubleshoot email issues when assigning winners.

## 🔍 Quick Debugging Steps

### 1. Check Environment Variables
First, verify your email configuration:

```bash
cd backend
node test-email-config.js
```

This will show:
- ✅ SMTP configuration
- ✅ Connection test
- ✅ Email sending test

### 2. Test Email Functionality
Use the test endpoint to verify email sending:

```bash
# Test with curl
curl -X POST http://localhost:3000/api/test/test-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"recipientEmail": "your-email@example.com"}'
```

### 3. Check Backend Logs
When assigning winners, look for these log messages:

```
🔍 Backend - Winner emails sent: { successful: X, failed: Y, total: Z }
🔍 Email Service - SMTP Configuration: { host, port, user, pass }
🔍 Email Service - Sending winner email to: email@example.com
🔍 Email Service - Winner email sent successfully
```

## 🚨 Common Issues & Solutions

### Issue 1: "SMTP_PASS is NOT_SET"
**Solution**: Add email configuration to your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Issue 2: "Authentication Error (EAUTH)"
**Solution**: For Gmail, use App Password:
1. Enable 2-Factor Authentication
2. Generate App Password for "Mail"
3. Use App Password as `SMTP_PASS`

### Issue 3: "No emails to send"
**Solution**: Check if winners have valid email addresses:
1. Verify submissions have `submittedBy` with email
2. Check team members have valid emails
3. Look for "No valid recipient found" in logs

### Issue 4: "Connection Error (ECONNECTION)"
**Solution**: 
1. Check internet connection
2. Verify SMTP host and port
3. Check firewall settings

## 🔧 Debugging Commands

### Test SMTP Configuration
```bash
cd backend
node test-email-config.js
```

### Test Email Templates
```bash
cd backend
node test-email.js
```

### Check Environment Variables
```bash
cd backend
node -e "require('dotenv').config(); console.log('SMTP_USER:', process.env.SMTP_USER); console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'NOT_SET');"
```

## 📋 Email Configuration Examples

### Gmail (Recommended)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

## 🧪 Testing from Frontend

1. Add the EmailTest component to your app
2. Navigate to the test page
3. Enter your email address
4. Click "Send Test Email"
5. Check the result

## 📊 Log Analysis

### Successful Email Logs
```
🔍 Email Service - SMTP Configuration: { host: 'smtp.gmail.com', port: 587, user: '***', pass: '***' }
🔍 Email Service - Attempting to send winner email to: user@example.com
🔍 Email Service - Mail options: { from: '...', to: 'user@example.com', subject: '...' }
🔍 Email Service - Winner email sent successfully: { to: 'user@example.com', messageId: '...' }
🔍 Email Service - Bulk winner emails completed: { successful: 1, failed: 0, total: 1 }
```

### Error Logs
```
🔍 Email Service - Error sending winner email: Error: Invalid login
🔍 Email Service - Error details: { message: 'Invalid login', code: 'EAUTH' }
🔍 Email Service - Failed to send winner email to user@example.com: Error: Invalid login
```

## 🛠️ Manual Testing

### Test Email Service Directly
```javascript
// In backend directory
const { sendWinnerEmail } = require('./services/emailService');

const testData = {
  _id: 'test',
  projectTitle: 'Test Project',
  teamName: 'Test Team',
  leaderName: 'Test User',
  pptScore: 8.5,
  projectScore: 9.0,
  combinedScore: 8.75
};

const hackathonData = {
  title: 'Test Hackathon',
  winners: [testData]
};

sendWinnerEmail(testData, hackathonData, 1, 'your-email@example.com')
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error));
```

## 📞 Support

If you're still having issues:

1. **Check the logs** for specific error messages
2. **Verify email configuration** using the test scripts
3. **Test with a different email provider** if Gmail doesn't work
4. **Check your email spam folder** for test emails

## 🔄 Troubleshooting Checklist

- [ ] Environment variables are set correctly
- [ ] SMTP connection test passes
- [ ] Email sending test works
- [ ] Winners have valid email addresses
- [ ] Backend logs show email attempts
- [ ] No firewall blocking SMTP
- [ ] Email provider allows SMTP access 