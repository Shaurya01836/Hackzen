require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Import route files
const hackathonRoutes = require('./routes/hackathonRoutes');
const userRoutes = require('./routes/userRoutes'); // teammate's route

// App middleware
app.use(express.json());

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
