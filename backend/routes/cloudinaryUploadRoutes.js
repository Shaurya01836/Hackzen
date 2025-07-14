// routes/cloudinaryUploadRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/cloudinaryUpload");
const { uploadPPT } = require("../middleware/cloudinaryUpload");

// POST /api/uploads/image
router.post("/image", upload.single("image"), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    return res.status(200).json({
      url: file.path,
      publicId: file.filename,
      width: file.width,
      height: file.height,
      format: file.format,
      size: file.bytes
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ message: "Server error uploading image" });
  }
});

// POST /api/uploads/ppt
router.post("/ppt", uploadPPT.single("ppt"), (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    return res.status(200).json({
      url: file.path,
      publicId: file.filename,
      format: file.format,
      size: file.bytes
    });
  } catch (err) {
    console.error("Cloudinary PPT upload error:", err);
    res.status(500).json({ message: "Server error uploading ppt" });
  }
});

module.exports = router;
