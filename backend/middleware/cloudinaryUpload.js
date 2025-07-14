// middleware/cloudinaryUpload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hackzen",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [{ width: 1200, crop: "limit" }]
  }
});

const pptStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hackzen/ppt",
    allowed_formats: ["pptx"],
    resource_type: "raw"
  }
});

const upload = multer({ storage });
const uploadPPT = multer({ storage: pptStorage });

module.exports = upload;
module.exports.uploadPPT = uploadPPT;
