const mongoose = require("mongoose");
const User = require("./user");
const Project = require("./project");

const reportSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },
    siteEngineerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    workDone: { type: String, required: true },
    issuesFound: { type: String },

    images: [{ type: String }], // image URLs

    contractorComment: { type: String, default: "" },
    contractorStatus: {
      type: String,
      enum: ["approved", "declined", "pending"],
      default: "pending"
    },
    aiSummary: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
