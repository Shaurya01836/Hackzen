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
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  color: {
    type: String,
    default: "bg-gradient-to-br from-gray-50 to-slate-50",
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "private",
  },
  fields: [
    {
      label: { type: String, required: true }, // Field name (e.g. Name, Team Name)
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      fontSize: { type: Number, required: true },
      fontFamily: { type: String, required: true },
      fontWeight: { type: String, required: true },
      textAlign: { type: String, required: true },
      color: { type: String, required: true },
      content: { type: String, required: true }, // Default/sample text
    }
  ],
}, { timestamps: true });

module.exports = { CertificatePageSchema };
