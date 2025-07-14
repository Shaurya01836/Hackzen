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
  params: (req, file) => {
    // Always ensure .pptx extension at the end of public_id
    let baseName = file.originalname.replace(/\.[^/.]+$/, "");
    if (!baseName.toLowerCase().endsWith('.pptx')) {
      baseName = baseName + '.pptx';
    }
    return {
      folder: "hackzen/ppt",
      allowedFormats: ["pptx"],
      resource_type: "raw",
      public_id: baseName
    };
  }
});

const upload = multer({ storage });
const uploadPPT = multer({ storage: pptStorage });

module.exports = upload;
module.exports.uploadPPT = uploadPPT;
