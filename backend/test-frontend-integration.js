const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const JudgeAssignment = require('./model/JudgeAssignmentModel');
const Hackathon = require('./model/HackathonModel');
const User = require('./model/UserModel');
const Submission = require('./model/SubmissionModel');

async function testFrontendIntegration() {
  try {
    console.log('🧪 Testing Frontend-Backend Integration...\n');

    const timestamp = Date.now();
    const testHackathonId = new mongoose.Types.ObjectId();
    const testOrganizerId = new mongoose.Types.ObjectId();
    const testJudgeId = new mongoose.Types.ObjectId();
    const testTeamId = new mongoose.Types.ObjectId();

    // Create test data
    const organizer = await User.create({
      _id: testOrganizerId,
      name: `Test Organizer ${timestamp}`,
      email: `organizer-${timestamp}@test.com`,
      password: 'hashedpassword',
      role: 'organizer'
    });

    const judge = await User.create({
      _id: testJudgeId,
      name: `Test Judge ${timestamp}`,
      email: `judge-${timestamp}@test.com`,
      password: 'hashedpassword',
      role: 'judge'
    });

    const hackathon = await Hackathon.create({
      _id: testHackathonId,
      title: `Test Hackathon ${timestamp}`,
      description: 'Test hackathon for frontend integration',
      organizer: testOrganizerId,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      registrationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      difficultyLevel: 'Intermediate',
      rounds: [
        {
          name: 'Round 1',
          type: 'project',
          startDate: new Date(),
          endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }
      ]
    });

    // Create test submissions
    const submissions = [];
    for (let i = 1; i <= 3; i++) {
      const submission = await Submission.create({
        hackathonId: testHackathonId,
        submittedBy: testTeamId,
        projectTitle: `Test Project ${i}`,
        teamName: `Test Team ${i}`,
        status: 'submitted',
        submittedAt: new Date()
      });
      submissions.push(submission);
    }

    // Create judge assignment
    const judgeAssignment = await JudgeAssignment.create({
      hackathon: testHackathonId,
      judge: {
        _id: testJudgeId,
        email: `judge-${timestamp}@test.com`,
        name: `Test Judge ${timestamp}`,
        type: 'platform'
      },
      assignedBy: testOrganizerId,
      status: 'active',
      assignedRounds: []
    });

    console.log('✅ Test data created');

    // Test 1: Simulate assignment overview API
    console.log('\n📊 Test 1: Assignment Overview API');
    const overview = await simulateAssignmentOverviewAPI(testHackathonId);
    console.log(`- Total submissions: ${overview.totalSubmissions}`);
    console.log(`- Unassigned submissions: ${overview.unassignedSubmissions.length}`);
    console.log(`- Assigned submissions: ${overview.assignedSubmissions.length}`);

    // Test 2: Simulate bulk assignment API
    console.log('\n📝 Test 2: Bulk Assignment API');
    const assignmentResult = await simulateBulkAssignmentAPI(
      testHackathonId, 
      submissions.map(s => s._id), 
      [{
        evaluatorId: judgeAssignment._id.toString(),
        maxSubmissions: 2,
        evaluatorEmail: `judge-${timestamp}@test.com`
      }], 
      0
    );
    console.log(`- Assignment result: ${assignmentResult.assignedSubmissions} submissions assigned`);

    // Test 3: Simulate judge assigned submissions API
    console.log('\n👨‍⚖️ Test 3: Judge Assigned Submissions API');
    const judgeData = await simulateJudgeAssignedSubmissionsAPI(`judge-${timestamp}@test.com`);
    console.log(`- Judge has specific assignments: ${judgeData.hasSpecificAssignments}`);
    console.log(`- Judge assigned submissions: ${judgeData.submissions.length}`);

    // Test 4: Verify frontend data consistency
    console.log('\n🔍 Test 4: Frontend Data Consistency');
    const consistency = await verifyFrontendDataConsistency(testHackathonId, `judge-${timestamp}@test.com`);
    console.log(`- Overview matches judge data: ${consistency.overviewMatchesJudge}`);
    console.log(`- Assignment data is consistent: ${consistency.assignmentConsistent}`);

    console.log('\n✅ Frontend-Backend integration test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

async function simulateAssignmentOverviewAPI(hackathonId) {
  const judgeAssignments = await JudgeAssignment.find({ hackathon: hackathonId }).lean();
  const submissions = await Submission.find({ hackathonId: hackathonId, status: 'submitted' }).lean();

  const submissionAssignments = {};
  submissions.forEach(sub => {
    submissionAssignments[sub._id.toString()] = [];
  });

  judgeAssignments.forEach(judgeAssignment => {
    const judgeEmail = judgeAssignment.judge?.email || judgeAssignment.judge.email;
    (judgeAssignment.assignedRounds || []).forEach(round => {
      (round.assignedSubmissions || []).forEach(subId => {
        if (submissionAssignments[subId.toString()]) {
          submissionAssignments[subId.toString()].push({
            judgeEmail,
            judgeName: judgeAssignment.judge?.name || judgeEmail,
            roundIndex: round.roundIndex,
            roundName: round.roundName,
            roundType: round.roundType
          });
        }
      });
    });
  });

  const unassignedSubmissions = submissions.filter(sub =>
    (submissionAssignments[sub._id.toString()] || []).length === 0
  );

  const assignedSubmissions = submissions.filter(sub =>
    (submissionAssignments[sub._id.toString()] || []).length > 0
  );

  return {
    totalSubmissions: submissions.length,
    unassignedSubmissions,
    assignedSubmissions
  };
}

async function simulateBulkAssignmentAPI(hackathonId, submissionIds, evaluatorAssignments, roundIndex) {
  const allEvaluators = await JudgeAssignment.find({ 
    hackathon: hackathonId,
    status: { $in: ['active', 'pending'] }
  });

  const results = [];
  let remainingSubmissions = [...submissionIds];

  for (const assignment of evaluatorAssignments) {
    const { evaluatorId, maxSubmissions } = assignment;
    const evaluatorAssignment = allEvaluators.find(e => e._id.toString() === evaluatorId);
    
    if (!evaluatorAssignment || evaluatorAssignment.status !== 'active') {
      continue;
    }

    const submissionsToAssign = remainingSubmissions.slice(0, maxSubmissions);
    remainingSubmissions = remainingSubmissions.filter(id => !submissionsToAssign.includes(id));

    const existingRoundIndex = evaluatorAssignment.assignedRounds.findIndex(r => r.roundIndex === roundIndex);
    
    if (existingRoundIndex >= 0) {
      evaluatorAssignment.assignedRounds[existingRoundIndex] = {
        ...evaluatorAssignment.assignedRounds[existingRoundIndex],
        roundIndex,
        roundName: `Round ${roundIndex + 1}`,
        roundType: 'project',
        isAssigned: true,
        assignedSubmissions: submissionsToAssign,
        maxSubmissions: maxSubmissions
      };
    } else {
      evaluatorAssignment.assignedRounds.push({
        roundIndex,
        roundName: `Round ${roundIndex + 1}`,
        roundType: 'project',
        isAssigned: true,
        assignedSubmissions: submissionsToAssign,
        maxSubmissions: maxSubmissions
      });
    }

    await evaluatorAssignment.save();
    results.push({
      evaluatorId: evaluatorAssignment._id,
      success: true,
      assignedSubmissions: submissionsToAssign
    });
  }

  return {
    assignedSubmissions: submissionIds.length - remainingSubmissions.length,
    results
  };
}

async function simulateJudgeAssignedSubmissionsAPI(judgeEmail) {
  const assignments = await JudgeAssignment.find({ 
    'judge.email': judgeEmail,
    status: 'active'
  }).populate('hackathon', 'name rounds');

  let hasSpecificAssignments = false;
  let assignedSubmissionIds = new Set();
  
  for (const assignment of assignments) {
    for (const round of assignment.assignedRounds) {
      if (round.isAssigned && round.assignedSubmissions && round.assignedSubmissions.length > 0) {
        hasSpecificAssignments = true;
        round.assignedSubmissions.forEach(id => assignedSubmissionIds.add(id.toString()));
      }
    }
  }

  const submissions = hasSpecificAssignments ? 
    await Submission.find({ _id: { $in: Array.from(assignedSubmissionIds) } }) : [];

  return {
    hasSpecificAssignments,
    submissions: submissions.map(s => s.toObject()),
    totalSubmissions: submissions.length
  };
}

async function verifyFrontendDataConsistency(hackathonId, judgeEmail) {
  const overview = await simulateAssignmentOverviewAPI(hackathonId);
  const judgeData = await simulateJudgeAssignedSubmissionsAPI(judgeEmail);

  const overviewMatchesJudge = judgeData.hasSpecificAssignments === (overview.assignedSubmissions.length > 0);
  
  const judgeAssignments = await JudgeAssignment.find({ 
    'judge.email': judgeEmail,
    hackathon: hackathonId,
    status: 'active'
  });

  let assignmentConsistent = true;
  for (const assignment of judgeAssignments) {
    for (const round of assignment.assignedRounds) {
      if (round.isAssigned && round.assignedSubmissions) {
        for (const subId of round.assignedSubmissions) {
          const found = overview.assignedSubmissions.find(s => s._id.toString() === subId.toString());
          if (!found) {
            assignmentConsistent = false;
            break;
          }
        }
      }
    }
  }

  return {
    overviewMatchesJudge,
    assignmentConsistent
  };
}

testFrontendIntegration(); 