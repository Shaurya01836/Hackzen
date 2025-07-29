# Enhanced Round-Wise Eligibility System

## Overview

The Enhanced Round-Wise Eligibility System ensures that only participants who qualified from the previous round can access and submit to subsequent rounds. This system provides precise control over hackathon progression and maintains data integrity across multiple rounds.

## Key Features

### 🎯 **Round-Wise Progression Control**
- **First Round**: Everyone is eligible to participate
- **Subsequent Rounds**: Only participants who qualified from the previous round can access
- **Clear Messaging**: Different messages for eligible vs non-eligible participants

### 📊 **Enhanced Data Tracking**
- **Team-based Eligibility**: Track which teams qualify for next round
- **Individual Eligibility**: Track which individual participants qualify
- **Submission Tracking**: Track which submissions qualify for next round
- **Round Progress**: Track completion status and eligibility flags

### 🔄 **Backward Compatibility**
- **Legacy Support**: Works with existing shortlisting data
- **Multiple Fallback Methods**: Ensures reliability across different data structures
- **Gradual Migration**: Can be enabled without breaking existing functionality

## Database Schema Enhancements

### Enhanced RoundProgress Schema

```javascript
roundProgress: [
  {
    roundIndex: { type: Number }, // index in rounds array
    advancedParticipantIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    shortlistedSubmissions: [{ type: Schema.Types.ObjectId, ref: 'Submission' }],
    shortlistedTeams: [{ type: Schema.Types.ObjectId }],
    shortlistedAt: { type: Date },
    
    // 🆕 Enhanced tracking for round-wise eligibility
    eligibleParticipants: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Participants eligible for next round
    eligibleTeams: [{ type: Schema.Types.ObjectId, ref: 'Team' }], // Teams eligible for next round
    eligibleSubmissions: [{ type: Schema.Types.ObjectId, ref: 'Submission' }], // Submissions that qualify for next round
    roundCompleted: { type: Boolean, default: false }, // Whether this round is completed and shortlisting done
    nextRoundEligibility: { type: Boolean, default: false }, // Whether participants can proceed to next round
  }
]
```

## API Endpoints

### 1. Enhanced Shortlisting Status
**Endpoint**: `GET /api/judge-management/hackathons/:hackathonId/shortlisting-status`

**Response**:
```javascript
{
  shortlistingStatus: {
    'round1ToRound2': {
      isShortlisted: true,
      shortlistingSource: 'enhanced_eligible_teams',
      shortlistingDetails: {
        teamId: 'team123',
        teamName: 'Team Alpha',
        roundIndex: 0,
        nextRoundIndex: 1
      },
      roundIndex: 0,
      nextRoundIndex: 1,
      roundProgress: {
        roundCompleted: true,
        nextRoundEligibility: true,
        shortlistedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  },
  totalRounds: 2,
  userTeam: 'team123',
  currentRound: 2
}
```

### 2. Round-Specific Eligibility
**Endpoint**: `GET /api/judge-management/hackathons/:hackathonId/rounds/:roundIndex/eligibility`

**Response**:
```javascript
{
  eligible: true,
  shortlisted: true,
  message: "You are eligible to submit to Round 2",
  roundStarted: true,
  roundStartDate: "2024-01-01T00:00:00.000Z",
  roundIndex: 1,
  eligibilityDetails: {
    teamId: 'team123',
    teamName: 'Team Alpha',
    previousRound: 0,
    currentRound: 1
  },
  eligibilitySource: 'enhanced_eligible_teams',
  isFirstRound: false
}
```

## Frontend Implementation

### Enhanced Eligibility Checking

```javascript
// Helper function to check if user is eligible for next round
const isEligibleForNextRound = (currentRoundIdx) => {
  if (currentRoundIdx === 0) {
    return true; // First round, everyone is eligible
  }
  
  // For any round that's not the final round, check if user has qualified from previous round
  if (currentRoundIdx < hackathon.rounds.length - 1 && nextRoundEligibility && nextRoundEligibility.shortlistingStatus) {
    // Check specific round transition
    const roundKey = `round${currentRoundIdx}ToRound${currentRoundIdx + 1}`;
    const roundStatus = nextRoundEligibility.shortlistingStatus[roundKey];
    
    if (roundStatus) {
      return roundStatus.isShortlisted || false;
    }
    
    // Fallback: check if user is eligible for any round
    const eligibilityEntries = Object.values(nextRoundEligibility.shortlistingStatus);
    return eligibilityEntries.some(entry => entry.isShortlisted);
  }
  
  return false;
};
```

### Submit Button Logic

```javascript
// Only show submit button to eligible teams for non-final rounds
(!isFinalRound && isEligible) || (isFinalRound && isEligible) ? (
  <button className="submit-button">
    Submit Project
  </button>
) : null
```

## Backend Implementation

### Enhanced Shortlisting Logic

```javascript
// Method 1: Check enhanced round progress for team-based eligibility
if (userTeam && roundProgress) {
  if (roundProgress.eligibleTeams && roundProgress.eligibleTeams.includes(userTeam._id.toString())) {
    isShortlisted = true;
    shortlistingSource = 'enhanced_eligible_teams';
    shortlistingDetails = {
      teamId: userTeam._id,
      teamName: userTeam.name,
      roundIndex: roundIndex,
      nextRoundIndex: nextRoundIndex
    };
  }
}

// Method 2: Check enhanced round progress for individual eligibility
if (!isShortlisted && roundProgress) {
  if (roundProgress.eligibleParticipants && roundProgress.eligibleParticipants.includes(userId.toString())) {
    isShortlisted = true;
    shortlistingSource = 'enhanced_eligible_participants';
    shortlistingDetails = {
      userId: userId,
      roundIndex: roundIndex,
      nextRoundIndex: nextRoundIndex
    };
  }
}

// Method 3: Check legacy shortlisted teams (backward compatibility)
if (!isShortlisted && roundProgress) {
  if (roundProgress.shortlistedTeams && roundProgress.shortlistedTeams.includes(userTeam?._id?.toString() || userId.toString())) {
    isShortlisted = true;
    shortlistingSource = 'legacy_shortlisted_teams';
  }
}
```

### Enhanced Round Progress Update

```javascript
// Update hackathon round progress with enhanced eligibility tracking
const roundProgressIndex = hackathon.roundProgress.findIndex(rp => rp.roundIndex === parseInt(roundIndex));

if (roundProgressIndex >= 0) {
  // Update existing round progress
  hackathon.roundProgress[roundProgressIndex].shortlistedSubmissions = submissionsToShortlist;
  hackathon.roundProgress[roundProgressIndex].shortlistedTeams = Array.from(shortlistedTeams);
  hackathon.roundProgress[roundProgressIndex].shortlistedAt = new Date();
  
  // Enhanced eligibility tracking
  hackathon.roundProgress[roundProgressIndex].eligibleTeams = Array.from(shortlistedTeams);
  hackathon.roundProgress[roundProgressIndex].eligibleSubmissions = submissionsToShortlist;
  hackathon.roundProgress[roundProgressIndex].roundCompleted = true;
  hackathon.roundProgress[roundProgressIndex].nextRoundEligibility = true;
  
  // Add eligible participants (both team members and individual participants)
  const eligibleParticipants = new Set();
  for (const teamId of shortlistedTeams) {
    const team = await Team.findById(teamId);
    if (team && team.members) {
      team.members.forEach(memberId => eligibleParticipants.add(memberId.toString()));
    }
  }
  hackathon.roundProgress[roundProgressIndex].eligibleParticipants = Array.from(eligibleParticipants);
}
```

## Usage Examples

### Example 1: 2-Round Hackathon (PPT + Project)

```javascript
// Round 1: PPT Round
// - Everyone can submit PPT
// - Organizer shortlists teams for Round 2

// Round 2: Project Round  
// - Only shortlisted teams can see submit button
// - Non-shortlisted teams see "Not Shortlisted" message
```

### Example 2: 3-Round Hackathon

```javascript
// Round 1: Initial Submission
// - Everyone eligible
// - Organizer shortlists for Round 2

// Round 2: Semi-Final
// - Only Round 1 qualifiers can submit
// - Organizer shortlists for Round 3

// Round 3: Final
// - Only Round 2 qualifiers can submit
// - Final winners selected
```

## Testing

### Test Script: `test-enhanced-round-eligibility.js`

```bash
# Run enhanced eligibility tests
node test-enhanced-round-eligibility.js
```

**Test Coverage**:
- Enhanced shortlisting status endpoint
- Round-specific eligibility checking
- Hackathon round progress data
- Enhanced eligibility logic
- Round-wise submission restrictions

## Configuration

### Environment Variables

```bash
# Required for email notifications
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Frontend URL for email links
FRONTEND_URL=http://localhost:5173
```

### Database Migration

The enhanced system is backward compatible and doesn't require immediate migration. Existing `roundProgress` entries will continue to work with legacy shortlisting methods.

## Troubleshooting

### Common Issues

1. **Submit button not showing for eligible participants**
   - Check if `isEligibleForNextRound()` is returning correct value
   - Verify shortlisting status data structure
   - Check round progress completion status

2. **Non-eligible participants can still submit**
   - Verify frontend eligibility checking logic
   - Check if backend eligibility endpoint is being called
   - Ensure round progress data is properly updated

3. **Legacy data not working**
   - System includes fallback methods for legacy data
   - Check if `shortlistedTeams` array contains correct IDs
   - Verify team/user ID formats match

### Debug Logging

The system includes comprehensive logging:

```javascript
console.log('🔍 isEligibleForNextRound:', { 
  currentRoundIdx, 
  roundsLength: hackathon.rounds?.length, 
  nextRoundEligibility 
});
```

## Future Enhancements

### Planned Features

1. **Advanced Round Types**
   - Support for different round types (PPT, Project, Interview, etc.)
   - Round-specific submission requirements

2. **Dynamic Eligibility Rules**
   - Configurable eligibility criteria per round
   - Score-based qualification thresholds

3. **Real-time Updates**
   - WebSocket notifications for eligibility changes
   - Live status updates for participants

4. **Analytics Dashboard**
   - Round progression analytics
   - Participant qualification rates
   - Performance metrics

### API Extensions

```javascript
// Future endpoints
GET /api/judge-management/hackathons/:hackathonId/rounds/:roundIndex/analytics
POST /api/judge-management/hackathons/:hackathonId/rounds/:roundIndex/eligibility-rules
GET /api/judge-management/hackathons/:hackathonId/rounds/:roundIndex/participant-status
```

## Conclusion

The Enhanced Round-Wise Eligibility System provides a robust, scalable solution for managing multi-round hackathons. It ensures proper progression control while maintaining backward compatibility and offering clear user feedback.

The system is designed to handle complex scenarios while remaining simple to use and maintain. With comprehensive testing and documentation, it provides a solid foundation for future enhancements. 