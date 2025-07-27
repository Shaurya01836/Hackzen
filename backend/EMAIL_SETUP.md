# Email Setup Guide

This guide explains how to configure email functionality for winner and shortlisted participant notifications.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Navigate to Security
   - Under "2-Step Verification", click on "App passwords"
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

## Other Email Providers

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

## Email Templates

The system includes two professional email templates:

### 1. Winner Email Template (`templates/winnerEmailTemplate.js`)
- **Recipients**: All winners
- **Content**: 
  - Congratulations message with position (1st, 2nd, 3rd place)
  - Individual scores (PPT, Project, Combined)
  - Complete winners table
  - Motivational content

### 2. Shortlisted Email Template (`templates/shortlistedEmailTemplate.js`)
- **Recipients**: Participants who made it to Round 2 but didn't win
- **Content**:
  - Recognition of Round 2 achievement
  - Individual performance scores
  - Complete winners table
  - Motivational content to keep going

## Features

### Winner Emails Include:
- 🏆 Position badges (1st, 2nd, 3rd place)
- 📊 Individual score breakdown
- 🏅 Complete winners table
- 🎯 Next steps and encouragement
- Professional HTML design with responsive layout

### Shortlisted Emails Include:
- 🎯 Round 2 achievement recognition
- 📊 Performance scores
- 🏅 Winners table for reference
- 💪 Motivational content
- 🚀 Next steps and community engagement

## Email Service Functions

The `services/emailService.js` provides:

1. **`sendWinnerEmail()`** - Send individual winner email
2. **`sendShortlistedEmail()`** - Send individual shortlisted email
3. **`sendBulkWinnerEmails()`** - Send emails to all winners
4. **`sendBulkShortlistedEmails()`** - Send emails to all shortlisted participants

## Testing

To test email functionality:

1. Configure your email settings in `.env`
2. Assign winners through the organizer dashboard
3. Check your email logs for success/failure messages
4. Emails are sent automatically when winners are assigned

## Error Handling

- Email failures don't prevent winner assignment
- Detailed logging for debugging
- Graceful fallback if email service is unavailable

## Customization

You can customize email templates by editing:
- `templates/winnerEmailTemplate.js`
- `templates/shortlistedEmailTemplate.js`

The templates use HTML/CSS for professional styling and include both HTML and text versions for compatibility. 