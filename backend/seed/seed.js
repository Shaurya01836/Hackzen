require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/UserModel');
const Team = require('../models/TeamModel');
const Project = require('../models/ProjectModel');
const Score = require('../models/ScoreModel');
const SubmissionHistory = require('../models/SubmissionHistoryModel');
const TeamInvite = require('../models/TeamInviteModel');
const Plan = require('../models/PlanModel');
const Badge = require("../models/BadgeModel");
const ChatRoom = require("../models/ChatRoomModel");
const Hackathon = require("../models/HackathonModel");
const Message = require("../models/MessageModel");
const Announcement = require("../models/AnnouncementModel");
const Notification = require("../models/NotificationModel");

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
} = require('../data/generateDummy');

const seedDatabase = async () => {
try {
await mongoose.connect(process.env.MONGO_URI);
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
const users = generateUsers(10);
const teams = generateTeams(users, 5);
const projects = generateProjects(teams, users, 5);
const scores = generateScores(projects, users, 5);
const histories = generateSubmissionHistories(projects, 5);
const invites = generateTeamInvites(teams, users, 5);
const plans = generatePlans(users, 3);
const badges = generateBadges(5);
const hackathons = generateHackathons(users, 5);
const chatRooms = generateChatRooms(hackathons, [], 5);
const messages = generateMessages(chatRooms, users, 10);
const announcements = generateAnnouncements(hackathons, users, 5);
const notifications = generateNotifications(users, 5);

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