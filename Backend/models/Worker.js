const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    // Contractor who owns this worker
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Current project assignment (TEMPORARY)
    currentProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null
    },

    // Assignment status
    status: {
      type: String,
      enum: ["free", "assigned"],
      default: "free"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Worker", workerSchema);
