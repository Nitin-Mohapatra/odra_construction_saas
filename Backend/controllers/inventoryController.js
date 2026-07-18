const InventoryItem = require("../models/inventoryItem");
const Project = require("../models/project");
const InventoryUsage = require("../models/InventoryUsage");
const InventoryPurchase = require("../models/InventoryPurchase");
const { default: mongoose } = require("mongoose");

/* --------------------------------
   Add material to project
--------------------------------- */
exports.addInventoryItem = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, unit, quantity, pricePerUnit, supplierName, companyName ,purchaseDate} = req.body;

    if (!name || !unit || quantity == null || !purchaseDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const project = await Project.findOne({ _id: projectId, organizationId: req.user.organizationId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    //  Only contractor who owns project
    // if (project.contractor.toString() !== req.user.User_id.toString()) {
    //   return res.status(403).json({ message: "Not authorized" });
    // }

    // 🔒 Lock inventory if project completed
    if (project.status === "Completed") {
      return res.status(400).json({
        message: "Inventory is locked for completed projects"
      });
    }

    const normalizedName = name.trim().toLowerCase();
    const normalizedUnit = unit.trim().toLowerCase();
    const qty = Number(quantity);
    const price = Number(pricePerUnit);

    // 🔍 Check if item already exists
    let item = await InventoryItem.findOne({
      projectId,
      name: normalizedName,
      unit: normalizedUnit
    });

    if (item) {
      // 🔁 RENEW EXISTING MATERIAL
      item.totalQuantity += qty;
      item.availableQuantity += qty;
      await item.save();
    } else {
      // ➕ CREATE NEW MATERIAL
      item = await InventoryItem.create({
        projectId,
        name: normalizedName,
        supplierName,
        companyName,
        unit: normalizedUnit,
        pricePerUnit: price,
        totalQuantity: qty,
        availableQuantity: qty,
        createdBy: req.user.User_id,
        organizationId: req.user.organizationId,
      });
    }

    // for refill or new item always create inventory purchase. 
    await InventoryPurchase.create({
      projectId,
      organizationId: req.user.organizationId,
      inventoryItemId: item._id,
      purchaseDate,
      quantity: qty,
      pricePerUnit: price,
      supplierName,
      companyName,
      createdBy: req.user.User_id
    });

    // 🔔 Emit socket event (both add & renew)
    const io = req.app.get("io");
    if (io) {
      io.to(`project-${projectId}`).emit("inventory:item-added", {
        item
      });
    }

    return res.status(200).json({
      success: true,
      item
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* --------------------------------
   Get project inventory
--------------------------------- */
exports.getProjectInventory = async (req, res) => {
  try {
    const { projectId } = req.params;

    const items = await InventoryItem.find({ projectId, organizationId: req.user.organizationId }).populate({
      path: "projectId",
      select: "title contractor",
      populate: {
        path: "contractor",
        select: "name"
      }
    });

    const itemsWithLowStock = items.map(item => {
      const lowStockThreshold = item.totalQuantity * 0.2;
      const isLowStock = item.availableQuantity <= lowStockThreshold;

      return {
        ...item._doc,
        isLowStock
      };
    });

    res.status(200).json({
      success: true,
      items: itemsWithLowStock
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* --------------------------------
   Record inventory usage
--------------------------------- */
exports.logInventoryUsage = async (req, res) => {
  try {
    const { projectId, inventoryItemId, usedQty, date } = req.body;
    console.log(req.body);
    console.log(projectId, inventoryItemId, usedQty, date);
    if (!projectId || !inventoryItemId || !usedQty || !date) {
      return res.status(400).json({
        message: "All fields are required 4"
      });
    }

    const project = await Project.findOne({ _id: projectId, organizationId: req.user.organizationId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔐 lock if completed
    if (project.status === "Completed") {
      return res.status(400).json({
        message: "Inventory is locked for completed projects"
      });
    }

    const item = await InventoryItem.findOne({
      _id: inventoryItemId,
      organizationId: req.user.organizationId
    });
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    // 🚫 prevent over-usage
    if (usedQty > item.availableQuantity) {
      return res.status(400).json({
        message: "Used quantity exceeds available stock"
      });
    }

    // 1️⃣ Save usage (audit-safe)
    const usageCost = usedQty * item.pricePerUnit;

    await InventoryUsage.create({
      projectId,
      inventoryItemId,
      organizationId: req.user.organizationId,
      usedQty,
      costAtThatTime: usageCost,
      usedBy: req.user.User_id,
      date
    });

    // 2️⃣ Deduct stock
    item.availableQuantity -= usedQty;
    await item.save();

    const lowStockThreshold = item.totalQuantity * 0.2;
    const isLowStock = item.availableQuantity <= lowStockThreshold;

    // emit socket io to client
    const io = req.app.get("io");

    // 🔴 REAL-TIME UPDATE
    if (io) {
      io.to(`project-${projectId}`).emit("inventory:updated", {
        inventoryItemId,
        availableQuantity: item.availableQuantity,
        updatedBy: req.user.User_id,
        isLowStock
      });
    }


    res.status(201).json({
      success: true,
      message: "Inventory usage recorded"
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

/* --------------------------------
   Get inventory usage history
--------------------------------- */
exports.getInventoryUsageHistory = async (req, res) => {
  try {
    const { projectId } = req.params;

    const history = await InventoryUsage.find({ projectId, organizationId: req.user.organizationId })
      .populate("inventoryItemId", "name unit")
      .populate("usedBy", "name")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      history
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* --------------------------------
   Get project cost summary
--------------------------------- */
exports.getInventorySummary = async (req, res) => {
  try {
    const { projectId } = req.params;

    const organizationId = req.user.organizationId;

    // inventory aggregation
    const inventoryAgg = await InventoryItem.aggregate([
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
          organizationId: new mongoose.Types.ObjectId(organizationId)
        }
      },
      {
        $group: {
          _id: null,
          totalPurchasedValue: {
            $sum: { $multiply: ["$totalQuantity", "$pricePerUnit"] }
          },
          remainingStockValue: {
            $sum: { $multiply: ["$availableQuantity", "$pricePerUnit"] }
          }
        }
      }
    ]);

    // usage Aggregation
    const usageAgg = await InventoryUsage.aggregate([
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
          organizationId: new mongoose.Types.ObjectId(organizationId)
        }
      },
      {
        $group: {
          _id: null,
          totalUsedCost: { $sum: "$costAtThatTime" }
        }
      }
    ]);

    console.log("inventoryAgg = ", inventoryAgg, " usageAgg =", usageAgg);

    // 🔹 3️⃣ Safe fallback (if no data)
    const totalPurchasedValue = inventoryAgg[0]?.totalPurchasedValue || 0;
    const remainingStockValue = inventoryAgg[0]?.remainingStockValue || 0;
    const totalUsedCost = usageAgg[0]?.totalUsedCost || 0;

    return res.status(200).json({
      success: true,
      totalPurchasedValue,
      totalUsedCost,
      remainingStockValue
    });

    // // 1️⃣ Get all inventory items
    // const items = await InventoryItem.find({ projectId ,organizationId: req.user.organizationId});

    // // 2️⃣ Get all usage records
    // const usageRecords = await InventoryUsage.find({ projectId,organizationId: req.user.organizationId });

    // // 3️⃣ Calculate totals

    // // Total purchased value
    // const totalPurchasedValue = items.reduce((sum, item) => {
    //   return sum + (item.totalQuantity * item.pricePerUnit);
    // }, 0);

    // // Total used cost (already stored snapshot-safe)
    // const totalUsedCost = usageRecords.reduce((sum, record) => {
    //   return sum + record.costAtThatTime;
    // }, 0);

    // // Remaining stock value
    // const remainingStockValue = items.reduce((sum, item) => {
    //   return sum + (item.availableQuantity * item.pricePerUnit);
    // }, 0);

    // return res.status(200).json({
    //   success: true,
    //   totalPurchasedValue,
    //   totalUsedCost,
    //   remainingStockValue
    // });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* --------------------------------
   Get inventory purchase history
--------------------------------- */
exports.getInventoryPurchaseHistory = async (req, res) => {

  try {

    const { projectId } = req.params;

    const history = await InventoryPurchase.find({
      projectId,
      organizationId: req.user.organizationId
    })
      .populate("inventoryItemId", "name unit")
      .populate("createdBy", "name")
      .sort({ purchaseDate: -1 });

    return res.status(200).json({
      success: true,
      history
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }

};