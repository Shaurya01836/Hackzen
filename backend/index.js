require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Import route files
const hackathonRoutes = require('./routes/hackathonRoutes');
const userRoutes = require('./routes/userRoutes');

// App settings
app.use(express.json());
app.use('/api/hackathons', hackathonRoutes); // mount your route
app.use('/api/users', userRoutes);

// Mongo URI and port
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;

// Connect DB first, then start server
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("DB connected");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("DB connection error:", err.message);
});
