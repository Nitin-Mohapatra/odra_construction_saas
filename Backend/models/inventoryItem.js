const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      required: true
    },

    // 🆕 PRICE PER UNIT
    pricePerUnit: {
      type: Number,
      required: true
    },

    totalQuantity: {
      type: Number,
      required: true
    },
    availableQuantity: {
      type: Number,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
