// index.js
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const MongoStore = require("connect-mongo");

const socketHandler = require("./config/socket");
require("./config/passport"); // Passport strategies

const app = express();

// ✅ CORS (Allow frontend origin)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Sessions for OAuth login persistence
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "lax",
    secure: false, // set true in production
  }
}));

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ All API routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/hackathons", require("./routes/hackathonRoutes"));
app.use("/api/teams", require("./routes/teamRoutes"));
app.use("/api/team-invites", require("./routes/teamInviteRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/submissions", require("./routes/submissionHistoryRoutes"));
app.use("/api/scores", require("./routes/scoreRoutes"));
app.use("/api/badges", require("./routes/badgeRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/chatrooms", require("./routes/chatRoomRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/uploads", require("./routes/cloudinaryUploadRoutes"));
app.use("/api/registration", require("./routes/registrationRoutes"));
app.use("/api/organizations", require("./routes/organizationRoutes"));

// ✅ HTTP + Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  }
});

socketHandler(io);

// Connect MongoDB and start server
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server + Socket.IO running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
