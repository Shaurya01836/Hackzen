require("dotenv").config();

const express = require("express");
const session = require('express-session');
const passport = require('passport');
require('./config/passport'); 
const mongoose = require("mongoose");
const app = express();

// Import route files
const hackathonRoutes = require('./routes/hackathonRoutes');
const userRoutes = require('./routes/userRoutes');

// App middleware
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
app.use('/api/users', userRoutes); // user management (register/login etc)

// Mongo URI and port
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;

// Connect DB first, then start server
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ DB connected");

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ DB connection error:", err.message);
});
