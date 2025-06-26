require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./config/socket");
const MongoStore = require('connect-mongo'); // ✅ persist sessions
const cloudinaryUploadRoutes = require("./routes/cloudinaryUploadRoutes");

require("./config/passport"); // load strategies

const app = express();

// ✅ CORS setup (frontend origin)
app.use(cors({
  origin: "http://localhost:5173",

  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session setup for OAuth persistence
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }), // store in MongoDB
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax', // frontend/backend same origin
    secure: false,   // set to true in production (with HTTPS)
  }
}));

// ✅ Passport setup
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
// ✅ Routes
app.use('/api/hackathons', require('./routes/hackathonRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/team-invites', require('./routes/teamInviteRoutes'));
app.use('/api/submissions', require('./routes/submissionHistoryRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/scores', require('./routes/scoreRoutes'));
app.use('/api/badges', require('./routes/badgeRoutes'));
app.use('/api/chatrooms', require('./routes/chatRoomRoutes'));     // ✅ ADDED
app.use('/api/messages', require('./routes/messageRoutes'));       // ✅ ADDED
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use("/api/uploads", require("./routes/cloudinaryUploadRoutes"));
app.use("/api/registration", require("./routes/hackathonRegistrationRoutes"));
app.use('/api/organizations', require('./routes/organizationRoutes'));
app.use("/api/articles", require('./routes/articleRoutes'));

// ✅ HTTP + Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
   origin: "http://localhost:5173",
    credentials: true,
  }
});

socketHandler(io);

// MongoDB and Start server
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server + Socket.IO at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
  });