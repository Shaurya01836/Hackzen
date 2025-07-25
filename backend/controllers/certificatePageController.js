const CertificatePage = require("../model/CertificatePageModel");
const mongoose = require("mongoose");

// Get certificates - Admin shared (public or isDefault) + Organizer's own
exports.getCertificates = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const certificates = await CertificatePage.find({
      $or: [
        { visibility: "public" },
        { isDefault: true },
        { createdBy: new mongoose.Types.ObjectId(userId) },
      ],
    }).populate("createdBy", "name email role");

    res.status(200).json(certificates);
  } catch (err) {
    console.error("Error fetching certificates:", err);
    res.status(500).json({ error: "Failed to fetch certificate pages." });
  }
};

// Create new certificate
exports.createCertificate = async (req, res) => {
  try {
    const {
      title,
      description = "",
      preview,
      color = "bg-gradient-to-br from-gray-50 to-slate-50",
      isDefault = false,
      visibility, // allow override if organizer wants to make it public later
      fields = [] // <-- accept fields from request
    } = req.body;

    const createdBy = req.user?._id;
    const role = req.user?.role;

    if (!createdBy) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    // Force visibility = public if admin
    const finalVisibility = role === "admin" ? "public" : (visibility || "private");

    const newCertificate = new CertificatePage({
      title,
      description,
      preview,
      color,
      isDefault,
      visibility: finalVisibility,
      createdBy,
      fields // <-- save fields array
    });

    await newCertificate.save();
    return res.status(201).json(newCertificate);
  } catch (err) {
    console.error("Error creating certificate:", err);
    return res.status(400).json({ error: "Failed to create certificate page." });
  }
};


// Delete certificate (admin or creator only)
exports.deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    const cert = await CertificatePage.findById(id);
    if (!cert) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    const isAdmin = currentUser.role === "admin";
    const isOwner = cert.createdBy?.toString() === currentUser._id.toString();

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not authorized to delete this certificate" });
    }

    await CertificatePage.findByIdAndDelete(id);
    res.status(200).json({ message: "Certificate deleted successfully" });
  } catch (err) {
    console.error("Error deleting certificate:", err);
    res.status(500).json({ error: "Failed to delete certificate page." });
  }
};

// Update certificate template
exports.updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;
    const cert = await CertificatePage.findById(id);
    if (!cert) {
      return res.status(404).json({ error: "Certificate not found" });
    }
    const isAdmin = currentUser.role === "admin";
    const isOwner = cert.createdBy?.toString() === currentUser._id.toString();
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Not authorized to update this certificate" });
    }
    // Update fields
    const updatableFields = [
      "title", "description", "preview", "color", "isDefault", "visibility", "fields"
    ];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        cert[field] = req.body[field];
      }
    });
    await cert.save();
    res.status(200).json(cert);
  } catch (err) {
    console.error("Error updating certificate:", err);
    res.status(500).json({ error: "Failed to update certificate page." });
  }
};
