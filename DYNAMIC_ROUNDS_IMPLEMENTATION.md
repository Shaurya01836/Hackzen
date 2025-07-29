# Dynamic Rounds Implementation

## Overview

This implementation provides a comprehensive solution for managing dynamic rounds in hackathons, where participants can be shortlisted between rounds and only shortlisted participants can submit to subsequent rounds.

## Key Features

### 1. Multi-Round Support
- Support for unlimited number of rounds
- Dynamic shortlisting between rounds
- Clear messaging for shortlisted vs non-shortlisted participants

### 2. Shortlisting System
- Multiple shortlisting methods (top N, threshold, date-based)
- Team-based and individual shortlisting support
- Comprehensive shortlisting status tracking

### 3. User Experience
- Clear visual indicators for shortlisting status
- Appropriate messages for different scenarios
- Submit button only appears for eligible participants

## Database Schema

### Hackathon Schema
```javascript
rounds: [{
  name: String,
  type: String,
  description: String,
  startDate: Date,
  endDate: Date,
  assignmentMode: String,
  judgingCriteria: {
    project: [...],
    presentation: [...]
  }
}],

roundProgress: [{
  roundIndex: Number,
  advancedParticipantIds: [ObjectId],
  shortlistedSubmissions: [ObjectId],
  shortlistedTeams: [ObjectId],
  shortlistedAt: Date
}]
```

### Submission Schema
```javascript
{
  status: String, // 'submitted', 'reviewed', 'shortlisted', 'rejected', 'winner'
  shortlistedAt: Date,
  shortlistedForRound: Number, // Which round the submission was shortlisted for
  roundIndex: Number // Current round index
}
```

## API Endpoints

### 1. Get Shortlisting Status
```
GET /api/judge-management/hackathons/:hackathonId/shortlisting-status
```
Returns comprehensive shortlisting status for all rounds.

### 2. Check Round Eligibility
```
GET /api/judge-management/hackathons/:hackathonId/rounds/:roundIndex/eligibility
```
Checks if a user is eligible for a specific round.

### 3. Perform Shortlisting
```
POST /api/judge-management/hackathons/:hackathonId/rounds/:roundIndex/shortlist
```
Shortlists participants for the next round.

## Frontend Implementation

### Key Components

#### 1. HackathonTimeline.jsx
- Displays rounds with appropriate UI based on shortlisting status
- Shows submit buttons only for eligible participants
- Displays clear messages for shortlisted vs non-shortlisted participants

#### 2. Shortlisting Logic
```javascript
// Check if user is shortlisted for next round
const isShortlistedForNextRound = (currentRoundIdx) => {
  if (currentRoundIdx === 0) return true; // First round, everyone eligible
  if (currentRoundIdx < hackathon.rounds.length - 1 && nextRoundEligibility) {
    return nextRoundEligibility.hasShortlistedSubmissions || false;
  }
  return false;
};
```

### UI Messages

#### For Shortlisted Participants
```jsx
<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
  <h3 className="font-semibold text-green-800">
    🎉 Congratulations! You're Shortlisted for Round {idx + 2}
  </h3>
  <p className="text-sm text-green-700">
    Your Round {idx + 1} submission has been shortlisted. 
    You can now submit a new project for Round {idx + 2}.
  </p>
  <button className="px-4 py-2 bg-green-600 text-white rounded">
    Submit Project for Round {idx + 2}
  </button>
</div>
```

#### For Non-Shortlisted Participants
```jsx
<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
  <h3 className="font-semibold text-red-800">
    Not Shortlisted for Round {idx + 2}
  </h3>
  <p className="text-sm text-red-700">
    Your Round {idx + 1} submission was not shortlisted for Round {idx + 2}. 
    Thank you for participating in this round.
  </p>
</div>
```

## Backend Implementation

### Key Functions

#### 1. getShortlistingStatus
- Comprehensive shortlisting status for all rounds
- Supports team-based and individual shortlisting
- Multiple shortlisting source tracking

#### 2. checkNextRoundEligibility
- Checks eligibility for specific rounds
- Handles first round (everyone eligible)
- Validates round start dates

#### 3. performShortlisting
- Supports multiple shortlisting modes
- Updates submission status and round progress
- Sends notifications to participants

### Shortlisting Methods

#### 1. Top N Method
```javascript
submissionsToShortlist = leaderboard
  .slice(0, shortlistCount)
  .map(entry => entry._id);
```

#### 2. Threshold Method
```javascript
submissionsToShortlist = leaderboard
  .filter(entry => entry.averageScore >= shortlistThreshold)
  .map(entry => entry._id);
```

#### 3. Date-based Method
```javascript
submissionsToShortlist = leaderboard.map(entry => entry._id);
```

## Usage Examples

### Creating a Multi-Round Hackathon

1. **Define Rounds**
```javascript
const hackathon = {
  rounds: [
    {
      name: "Round 1",
      type: "project",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-15")
    },
    {
      name: "Round 2", 
      type: "presentation",
      startDate: new Date("2024-01-20"),
      endDate: new Date("2024-01-25")
    }
  ]
};
```

2. **Perform Shortlisting**
```javascript
// Shortlist top 10 participants for Round 2
await fetch('/api/judge-management/hackathons/hackathonId/rounds/0/shortlist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mode: 'topN',
    shortlistCount: 10
  })
});
```

3. **Check Eligibility**
```javascript
// Check if user is eligible for Round 2
const response = await fetch('/api/judge-management/hackathons/hackathonId/rounds/1/eligibility');
const eligibility = await response.json();
```

## Testing

Use the provided test script to verify functionality:

```bash
node test-dynamic-rounds.js
```

## Configuration

### Environment Variables
- `MAIL_USER`: Email configuration for notifications
- `MAIL_PASS`: Email password for notifications

### Required Dependencies
- MongoDB for data storage
- Express.js for API endpoints
- React for frontend components

## Troubleshooting

### Common Issues

1. **Shortlisting not working**
   - Check if roundProgress is properly updated
   - Verify submission status is set to 'shortlisted'
   - Ensure shortlistedForRound field is set correctly

2. **UI not showing correct messages**
   - Check nextRoundEligibility state
   - Verify roundIndex calculations
   - Ensure proper shortlisting status fetching

3. **Participants can't submit to next round**
   - Verify eligibility endpoint response
   - Check if round has started
   - Ensure proper shortlisting logic

### Debug Endpoints

- `/api/judge-management/hackathons/:hackathonId/debug-shortlisting`
- `/api/judge-management/hackathons/:hackathonId/user-shortlisting-status`

## Future Enhancements

1. **Advanced Shortlisting Criteria**
   - Custom scoring algorithms
   - Weighted criteria evaluation
   - Automated shortlisting based on performance

2. **Enhanced Notifications**
   - Real-time notifications
   - Email templates customization
   - SMS notifications

3. **Analytics Dashboard**
   - Shortlisting statistics
   - Round progression analytics
   - Participant performance tracking

## Support

For issues or questions regarding the dynamic rounds implementation, please refer to the codebase documentation or create an issue in the project repository. 