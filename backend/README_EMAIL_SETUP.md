# Email Setup Guide

## Configure SMTP Settings

To enable email functionality (winner emails, test emails, etc.), you need to configure SMTP settings in your backend environment.

### 1. Create/Update .env file

Add these variables to your `backend/.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Alternative variable names (for compatibility)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Optional: Test email address
TEST_EMAIL=test@example.com
```

### 2. Gmail App Password Setup

If using Gmail:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `SMTP_PASS`

### 3. Test Email Configuration

After setting up the environment variables:

1. Restart your backend server
2. Go to the organizer dashboard
3. Navigate to the leaderboard
4. Click "Send Winner Emails"
5. Use the "Test Email Configuration" feature

### 4. Troubleshooting

**Common Issues:**

- **"SMTP not configured"**: Check your .env file variables
- **"Authentication failed"**: Verify your Gmail app password
- **"Connection timeout"**: Check your internet connection and firewall settings

**Debug Steps:**

1. Check console logs for SMTP configuration details
2. Verify environment variables are loaded
3. Test with a simple email first
4. Check Gmail's "Less secure app access" settings (if not using app password)

### 5. Email Features

Once configured, you can:

- ✅ Send winner emails to participants
- ✅ Send shortlisted participant emails
- ✅ Test email configuration
- ✅ Send team invitation emails
- ✅ Send role invitation emails

### 6. Security Notes

- Never commit your .env file to version control
- Use app passwords instead of your main password
- Consider using environment-specific configurations for production 