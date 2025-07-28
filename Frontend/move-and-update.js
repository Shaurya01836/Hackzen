import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Simulate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ========== FILE MOVE ==========
const fileName = "BlogDetails.jsx";

const oldFilePath = path.join(
  __dirname,
  "src/pages/AdminDashboard/sections/components",
  fileName
);

const newFolder = path.join(
  __dirname,
  "src/pages/AdminDashboard/components"
);

const newFilePath = path.join(newFolder, fileName);

// ✅ 1. Check if file exists
if (!fs.existsSync(oldFilePath)) {
  console.error("❌ File not found:", oldFilePath);
  process.exit(1);
}

// ✅ 2. Create destination folder if needed
fs.mkdirSync(newFolder, { recursive: true });

// ✅ 3. Move the file
fs.renameSync(oldFilePath, newFilePath);
console.log("✅ File moved successfully");
