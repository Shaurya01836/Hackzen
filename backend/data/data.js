const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');

const generateUsers = (count = 5) => {
  const users = [];
  const usedEmails = new Set();

  while (users.length < count) {
    const email = faker.internet.email();

    // Check: must be truthy + unique
    if (!email || typeof email !== 'string' || usedEmails.has(email.toLowerCase())) {
      continue;
    }

    usedEmails.add(email.toLowerCase());

    users.push({
      _id: new mongoose.Types.ObjectId(),
      name: faker.person.fullName(),
      email: email.toLowerCase(),
      passwordHash: faker.string.alphanumeric(64),
      authProvider: faker.helpers.arrayElement(['email', 'github', 'google']),
      githubUsername: faker.internet.username(),
      profileImage: faker.image.avatar(),
      role: faker.helpers.arrayElement(['participant', 'organizer', 'mentor', 'judge', 'admin']),
      skills: faker.helpers.arrayElements(['React', 'Node.js', 'MongoDB', 'CSS', 'Python', 'Docker'], 3),
      badges: [],
      hackathonsJoined: [],
      projects: [],
      createdAt: faker.date.past()
    });
  }

  return users;
};




const generateTeams = (users, count = 5) => {
const teams = [];

for (let i = 0; i < count; i++) {
const randomMembers = faker.helpers.arrayElements(users, 2); // select 2 random users
const mentor = faker.helpers.arrayElement(users);

teams.push({
  _id: new mongoose.Types.ObjectId(),
  name: faker.color.human() + ' Team',
  members: randomMembers.map((u) => u._id),
  hackathon: new mongoose.Types.ObjectId(),
  mentor: mentor._id,
  project: new mongoose.Types.ObjectId(),
  createdAt: faker.date.recent()
});
}

return teams;
};


const generateProjects = (teams, users, count = 5) => {
const projects = [];
for (let i = 0; i < count; i++) {
const team = faker.helpers.arrayElement(teams);
const user = faker.helpers.arrayElement(users);
projects.push({
_id: new mongoose.Types.ObjectId(),
title: faker.lorem.words(3),
description: faker.lorem.paragraph(),
repoLink: faker.internet.url(),
videoLink: faker.internet.url(),
team: team._id,
submittedBy: user._id,
hackathon: team.hackathon,
scores: [],
status: faker.helpers.arrayElement(['draft', 'submitted', 'reviewed']),
createdAt: faker.date.recent()
});
}
return projects;
};

const generateScores = (projects, users, count = 5) => {
const scores = [];
for (let i = 0; i < count; i++) {
const project = faker.helpers.arrayElement(projects);
const judge = faker.helpers.arrayElement(users);
scores.push({
_id: new mongoose.Types.ObjectId(),
project: project._id,
judge: judge._id,
criteria: faker.lorem.word(),
score: faker.number.int({ min: 1, max: 10 }),
feedback: faker.lorem.sentence(),
createdAt: faker.date.recent()
});
}
return scores;
};

const generateSubmissionHistories = (projects, count = 5) => {
const histories = [];
for (let i = 0; i < count; i++) {
const project = faker.helpers.arrayElement(projects);
histories.push({
_id: new mongoose.Types.ObjectId(),
projectId: project._id,
version: faker.number.int({ min: 1, max: 5 }),
repoSnapshot: faker.git.commitMessage(),
changes: faker.lorem.sentence(),
submittedAt: faker.date.recent()
});
}
return histories;
};

const generateTeamInvites = (teams, users, count = 5) => {
const invites = [];
for (let i = 0; i < count; i++) {
const team = faker.helpers.arrayElement(teams);
const invitedUser = faker.helpers.arrayElement(users);
const invitedBy = faker.helpers.arrayElement(users);
invites.push({
_id: new mongoose.Types.ObjectId(),
team: team._id,
invitedUser: invitedUser._id,
invitedBy: invitedBy._id,
hackathon: team.hackathon,
status: faker.helpers.arrayElement(['pending', 'accepted', 'declined']),
sentAt: faker.date.past(),
respondedAt: faker.date.recent()
});
}
return invites;
};

const generatePlans = (users, count = 3) => {
const plans = [];
for (let i = 0; i < count; i++) {
const organizer = faker.helpers.arrayElement(users);
plans.push({
_id: new mongoose.Types.ObjectId(),
organizer: organizer._id,
type: faker.helpers.arrayElement(['standard', 'premium']),
active: faker.datatype.boolean(),
startedAt: faker.date.past(),
expiresAt: faker.date.future()
});
}
return plans;
};

const generateBadges = (count = 5) => {
const badges = [];
for (let i = 0; i < count; i++) {
badges.push({
_id: new mongoose.Types.ObjectId(),
name: faker.word.adjective() + ' Badge',
description: faker.lorem.sentence(),
iconUrl: faker.image.url(),
criteria: "Win " + faker.number.int({ min: 1, max: 5 }) + " hackathons"
});
}
return badges;
};

const generateChatRooms = (hackathons, teams, count = 5) => {
  if (!hackathons.length || !teams.length) {
    console.warn("⚠️ Cannot generate chat rooms: hackathons or teams array is empty.");
    return [];
  }

  const chatRooms = [];
  for (let i = 0; i < count; i++) {
    const hackathon = faker.helpers.arrayElement(hackathons);
    const team = faker.helpers.arrayElement(teams);
    chatRooms.push({
      _id: new mongoose.Types.ObjectId(),
      hackathon: hackathon._id,
      team: team._id,
      type: faker.helpers.arrayElement(['general', 'team', 'mentor']),
      createdAt: faker.date.recent()
    });
  }
  return chatRooms;
};

const generateHackathons = (users, count = 5) => {
const hackathons = [];
for (let i = 0; i < count; i++) {
const organizer = faker.helpers.arrayElement(users);
const participants = faker.helpers.arrayElements(users, 5);
const mentors = faker.helpers.arrayElements(users, 2);
const judges = faker.helpers.arrayElements(users, 2);
hackathons.push({
_id: new mongoose.Types.ObjectId(),
title: faker.company.name() + " Hackathon",
description: faker.lorem.paragraph(),
startDate: faker.date.future(),
endDate: faker.date.future({ refDate: faker.date.future() }),
organizer: organizer._id,
problemStatements: [faker.hacker.phrase(), faker.hacker.phrase()],
participants: participants.map(u => u._id),
mentors: mentors.map(u => u._id),
judges: judges.map(u => u._id),
teams: [],
submissions: [],
chatRoom: null,
status: faker.helpers.arrayElement(['upcoming', 'ongoing', 'ended']),
createdAt: faker.date.past()
});
}
return hackathons;
};

const generateMessages = (chatRooms, users, count = 10) => {
const messages = [];
for (let i = 0; i < count; i++) {
const room = faker.helpers.arrayElement(chatRooms);
const sender = faker.helpers.arrayElement(users);
messages.push({
_id: new mongoose.Types.ObjectId(),
chatRoom: room._id,
sender: sender._id,
content: faker.hacker.phrase(),
timestamp: faker.date.recent()
});
}
return messages;
};

const generateAnnouncements = (hackathons, users, count = 5) => {
const announcements = [];
for (let i = 0; i < count; i++) {
const hackathon = faker.helpers.arrayElement(hackathons);
const user = faker.helpers.arrayElement(users);
announcements.push({
_id: new mongoose.Types.ObjectId(),
hackathon: hackathon._id,
message: faker.lorem.sentence(),
postedBy: user._id,
type: faker.helpers.arrayElement(['general', 'reminder', 'alert']),
createdAt: faker.date.recent(),
visibleUntil: faker.date.future()
});
}
return announcements;
};

const generateNotifications = (users, count = 5) => {
const notifications = [];
for (let i = 0; i < count; i++) {
const recipient = faker.helpers.arrayElement(users);
notifications.push({
_id: new mongoose.Types.ObjectId(),
recipient: recipient._id,
message: faker.lorem.sentence(),
type: faker.helpers.arrayElement(['info', 'warning', 'success']),
read: faker.datatype.boolean(),
createdAt: faker.date.recent()
});
}
return notifications;
};

module.exports = {
generateUsers,
generateTeams,
generateProjects,
generateScores,
generateSubmissionHistories,
generateTeamInvites,
generatePlans,
generateBadges,
generateChatRooms,
generateHackathons,
generateMessages,
generateAnnouncements,
generateNotifications
};