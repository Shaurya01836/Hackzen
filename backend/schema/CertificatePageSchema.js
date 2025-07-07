const { Schema } = require("mongoose");

const CertificatePageSchema = new Schema({
   title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  preview: {
    type: String,
    required: true, // image must be given
  },
  color: {
    type: String,
    default: "bg-gradient-to-br from-gray-50 to-slate-50", // default gradient
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = { CertificatePageSchema };