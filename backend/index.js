require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const testRoutes = require('./routes/testRoutes');

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URL;

const app = express();
app.use(express.json());
app.use('/api/test', testRoutes);



app.listen(PORT, () => {
console.log("App Started");
mongoose.connect(uri);
console.log("DB connected");
});