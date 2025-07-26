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
const Score = require('./model/ScoreModel');

async function testAssignmentFlow() {
  try {
    console.log('🧪 Testing Assignment Flow...\n');

    // Clean up existing test data
    const timestamp = Date.now();
    const testHackathonId = new mongoose.Types.ObjectId();
    const testOrganizerId = new mongoose.Types.ObjectId();
    const testJudgeId = new mongoose.Types.ObjectId();
    const testTeamId = new mongoose.Types.ObjectId();

    // Create test organizer
    const organizer = await User.create({
      _id: testOrganizerId,
      name: `Test Organizer ${timestamp}`,
      email: `organizer-${timestamp}@test.com`,
      password: 'hashedpassword',
      role: 'organizer'
    });

    // Create test judge
    const judge = await User.create({
      _id: testJudgeId,
      name: `Test Judge ${timestamp}`,
      email: `judge-${timestamp}@test.com`,
      password: 'hashedpassword',
      role: 'judge'
    });

    // Create test hackathon
    const hackathon = await Hackathon.create({
      _id: testHackathonId,
      title: `Test Hackathon ${timestamp}`,
      description: 'Test hackathon for assignment flow',
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
    for (let i = 1; i <= 5; i++) {
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

    console.log(`✅ Created ${submissions.length} test submissions`);

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

    console.log('✅ Created judge assignment');

    // Test 1: Check initial assignment overview
    console.log('\n📊 Test 1: Initial Assignment Overview');
    const initialOverview = await getAssignmentOverview(testHackathonId);
    console.log(`- Total submissions: ${initialOverview.totalSubmissions}`);
    console.log(`- Unassigned submissions: ${initialOverview.unassignedSubmissions.length}`);
    console.log(`- Assigned submissions: ${initialOverview.assignedSubmissions.length}`);

    // Test 2: Assign submissions to judge
    console.log('\n📝 Test 2: Assigning Submissions to Judge');
    const submissionIds = submissions.map(s => s._id);
    console.log('Judge assignment ID:', judgeAssignment._id.toString());
    const allEvaluators = await JudgeAssignment.find({ 
      hackathon: testHackathonId,
      status: { $in: ['active', 'pending'] }
    });
    console.log('Available evaluators:', allEvaluators.map(e => ({ id: e._id.toString(), email: e.judge.email, status: e.status })));
    
    const assignmentResult = await bulkAssignSubmissions(testHackathonId, submissionIds, [{
      evaluatorId: judgeAssignment._id.toString(),
      maxSubmissions: 3,
      evaluatorEmail: `judge-${timestamp}@test.com`
    }], 0);

    console.log(`- Assignment result: ${assignmentResult.assignedSubmissions} submissions assigned`);

    // Test 3: Check assignment overview after assignment
    console.log('\n📊 Test 3: Assignment Overview After Assignment');
    const afterOverview = await getAssignmentOverview(testHackathonId);
    console.log(`- Total submissions: ${afterOverview.totalSubmissions}`);
    console.log(`- Unassigned submissions: ${afterOverview.unassignedSubmissions.length}`);
    console.log(`- Assigned submissions: ${afterOverview.assignedSubmissions.length}`);

    // Test 4: Check judge's assigned submissions
    console.log('\n👨‍⚖️ Test 4: Judge Assigned Submissions');
    const judgeSubmissions = await getJudgeAssignedSubmissions(`judge-${timestamp}@test.com`);
    console.log(`- Judge has specific assignments: ${judgeSubmissions.hasSpecificAssignments}`);
    console.log(`- Judge assigned submissions: ${judgeSubmissions.submissions.length}`);

    // Test 5: Verify data consistency
    console.log('\n🔍 Test 5: Data Consistency Check');
    const consistencyCheck = await verifyDataConsistency(testHackathonId, `judge-${timestamp}@test.com`);
    console.log(`- Assignment overview matches judge assignments: ${consistencyCheck.overviewMatchesJudge}`);
    console.log(`- Judge assignments match submission assignments: ${consistencyCheck.judgeMatchesSubmissions}`);

    console.log('\n✅ Assignment flow test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
  }
}

async function getAssignmentOverview(hackathonId) {
  const hackathon = await Hackathon.findById(hackathonId);
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

async function bulkAssignSubmissions(hackathonId, submissionIds, evaluatorAssignments, roundIndex) {
  const hackathon = await Hackathon.findById(hackathonId);
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
      console.log(`Skipping evaluator ${evaluatorId}: status = ${evaluatorAssignment?.status}`);
      continue;
    }

    const submissionsToAssign = remainingSubmissions.slice(0, maxSubmissions);
    remainingSubmissions = remainingSubmissions.filter(id => !submissionsToAssign.includes(id));

    console.log(`Assigning ${submissionsToAssign.length} submissions to judge ${evaluatorAssignment.judge.email}`);

    const existingRoundIndex = evaluatorAssignment.assignedRounds.findIndex(r => r.roundIndex === roundIndex);
    
    if (existingRoundIndex >= 0) {
      // Update existing round assignment
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
      // Add new round assignment
      evaluatorAssignment.assignedRounds.push({
        roundIndex,
        roundName: `Round ${roundIndex + 1}`,
        roundType: 'project',
        isAssigned: true,
        assignedSubmissions: submissionsToAssign,
        maxSubmissions: maxSubmissions
      });
    }

    console.log('Saving judge assignment with rounds:', evaluatorAssignment.assignedRounds);
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

async function getJudgeAssignedSubmissions(judgeEmail) {
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

async function verifyDataConsistency(hackathonId, judgeEmail) {
  const overview = await getAssignmentOverview(hackathonId);
  const judgeData = await getJudgeAssignedSubmissions(judgeEmail);

  const overviewMatchesJudge = judgeData.hasSpecificAssignments === (overview.assignedSubmissions.length > 0);
  
  const judgeAssignments = await JudgeAssignment.find({ 
    'judge.email': judgeEmail,
    hackathon: hackathonId,
    status: 'active'
  });

  let judgeMatchesSubmissions = true;
  for (const assignment of judgeAssignments) {
    for (const round of assignment.assignedRounds) {
      if (round.isAssigned && round.assignedSubmissions) {
        for (const subId of round.assignedSubmissions) {
          const found = overview.assignedSubmissions.find(s => s._id.toString() === subId.toString());
          if (!found) {
            judgeMatchesSubmissions = false;
            break;
          }
        }
      }
    }
  }

  return {
    overviewMatchesJudge,
    judgeMatchesSubmissions
  };
}

testAssignmentFlow(); 