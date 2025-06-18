require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./config/socket");

require("./config/passport"); // passport strategies must be loaded after dotenv

const app = express();

// ✅ CORS setup (must be before all routes/middleware)
app.use(cors({
  origin: "http://localhost:5173", // Your React frontend
  credentials: true
}));

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Sessions (used by Passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// ✅ Passport.js init
app.use(passport.initialize());
app.use(passport.session());

// ✅ Your route imports
const hackathonRoutes = require('./routes/hackathonRoutes');
const userRoutes = require('./routes/userRoutes');
const teamRoutes = require('./routes/teamRoutes');
const teamInviteRoutes = require('./routes/teamInviteRoutes');
const submissionHistoryRoutes = require('./routes/submissionHistoryRoutes');
const projectRoutes = require('./routes/projectRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const badgeRoutes = require('./routes/badgeRoutes');

// ✅ Mount routes
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/team-invites', teamInviteRoutes);
app.use('/api/submissions', submissionHistoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/badges', badgeRoutes);

// ✅ Create HTTP server and socket.io instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow frontend to connect (use specific origin in prod)
    methods: ['GET', 'POST']
  }
});

// ✅ Attach socket logic
socketHandler(io);

// ✅ Start server
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;

mongoose.connect(uri)
  .then(() => {
    console.log("✅ DB connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server + Socket.IO running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err.message);
  });
