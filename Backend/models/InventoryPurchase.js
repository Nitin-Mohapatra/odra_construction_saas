const mongoose = require("mongoose");

const inventoryPurchaseSchema = new mongoose.Schema(
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

    inventoryItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryItem",
      required: true
    },

    purchaseDate: {
      type: Date,
      required: true
    },

    quantity: {
      type: Number,
      required: true
    },

    pricePerUnit: {
      type: Number,
      required: true
    },

    supplierName: {
      type: String,
      required: true
    },

    companyName: {
      type: String,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "InventoryPurchase",
  inventoryPurchaseSchema
);