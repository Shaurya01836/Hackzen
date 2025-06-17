require('dotenv').config({ path: '../.env' });

console.log("Loaded MONGO_URL:", process.env.MONGO_URL);

const mongoose = require('mongoose');

const User = require('../model/UserModel');
const Team = require('../model/TeamModel');
const Project = require('../model/ProjectModel');
const Score = require('../model/ScoreModel');
const SubmissionHistory = require('../model/SubmissionHistoryModel');
const TeamInvite = require('../model/TeamInviteModel');
const Plan = require('../model/PlanModel');
const Badge = require("../model/BadgeModel");
const ChatRoom = require("../model/ChatRoomModel");
const Hackathon = require("../model/HackathonModel");
const Message = require("../model/MessageModel");
const Announcement = require("../model/AnnouncementModel");
const Notification = require("../model/NotificationModel");

const {
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
} = require('../data/data.js');

const seedDatabase = async () => {
try {
await mongoose.connect(process.env.MONGO_URL);
console.log("✅ MongoDB connected");


// Clear collections
await Promise.all([
  User.deleteMany(),
  Team.deleteMany(),
  Project.deleteMany(),
  Score.deleteMany(),
  SubmissionHistory.deleteMany(),
  TeamInvite.deleteMany(),
  Plan.deleteMany(),
   Badge.deleteMany(),
  ChatRoom.deleteMany(),
  Hackathon.deleteMany(),
  Message.deleteMany(),
  Announcement.deleteMany(),
  Notification.deleteMany()
]);

// Generate and insert dummy data
const users = generateUsers(2);
const teams = generateTeams(users, 2);
const projects = generateProjects(teams, users, 2);
const scores = generateScores(projects, users, 2);
const histories = generateSubmissionHistories(projects, 2);
const invites = generateTeamInvites(teams, users, 2);
const plans = generatePlans(users, 2);
const badges = generateBadges(2);
const hackathons = generateHackathons(users, 2);
const chatRooms = generateChatRooms(hackathons, teams, 2);
const messages = generateMessages(chatRooms, users, 2);
const announcements = generateAnnouncements(hackathons, users, 2);
const notifications = generateNotifications(users, 2);

await mongoose.connection.db.dropCollection('users').catch(err => {
  if (err.code !== 26) throw err; // 26 = NamespaceNotFound = collection didn't exist yet
});


await User.insertMany(users);
await Team.insertMany(teams);
await Project.insertMany(projects);
await Score.insertMany(scores);
await SubmissionHistory.insertMany(histories);
await TeamInvite.insertMany(invites);
await Plan.insertMany(plans);
await Badge.insertMany(badges);
await Hackathon.insertMany(hackathons);
await ChatRoom.insertMany(chatRooms);
await Message.insertMany(messages);
await Announcement.insertMany(announcements);
await Notification.insertMany(notifications);

console.log("Dummy data inserted successfully!");
process.exit(0);
} catch (err) {
console.error("Error seeding data:", err);
process.exit(1);
}
};

seedDatabase();