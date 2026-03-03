const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      unique: true
    },

    plan: {
      type: String,
      enum: ["free", "business"],
      default: "free"
    },

    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active"
    },

    startDate: {
      type: Date,
      default: Date.now
    },

    endDate: {
      type: Date
    },
    tenure: {
      type: String,
      enum: ["6m", "12m"],
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);