require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");
const mongoose = require("mongoose");
const http = require("http"); // ✅ for socket.io support
const { Server } = require("socket.io");
const socketHandler = require("./config/socket"); // ✅ create this next
const app = express();

// Import route files
const hackathonRoutes = require('./routes/hackathonRoutes');
const userRoutes = require('./routes/userRoutes');
const teamRoutes = require('./routes/teamRoutes');
const teamInviteRoutes = require('./routes/teamInviteRoutes');
const submissionHistoryRoutes = require('./routes/submissionHistoryRoutes');
const projectRoutes = require('./routes/projectRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const badgeRoutes = require('./routes/badgeRoutes');



// Middleware
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Mount API routes
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/team-invites', teamInviteRoutes);
app.use('/api/submissions', submissionHistoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/badges', badgeRoutes);

// MongoDB URI and port
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;

// Create HTTP server and socket.io instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow frontend to connect — restrict in prod
    methods: ['GET', 'POST']
  }
});

// Attach socket logic
socketHandler(io);

// Connect to MongoDB and start the server
mongoose.connect(uri)
  .then(() => {
    console.log("DB connected");
    server.listen(PORT, () => {
      console.log(`Server + Socket.IO running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err.message);
  });
