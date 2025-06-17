const jwt = require('jsonwebtoken');

// Use an actual ObjectId from your User collection in MongoDB
const token = jwt.sign(
  { id: "6851032589bd1401e425e391" }, // Replace this with a real User _id
  "e4f86aaa73d0e41d3b907b383dca79f5db0585efb5a115053af47017b59ed2f46624980bcc4d98dbe2ce409d47e80cfc8350fe3586f4ce570beef64dbc888c16", // Replace this with your JWT_SECRET from .env
  { expiresIn: "7d" }
);

console.log("Generated JWT token:\n");
console.log(token);
