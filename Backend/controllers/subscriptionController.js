const { error } = require("console");
const Subscription = require("../models/Subscription");
const razorpay = require("../utils/razorpay");
const crypto = require("crypto");

exports.getMySubscription = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const subscription = await Subscription.findOne({ organizationId });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // 🔥 Auto expiry check
    if (
      subscription.plan === "business" &&
      subscription.endDate &&
      new Date() > subscription.endDate
    ) {
      subscription.status = "expired";
      subscription.plan = "free";
      subscription.tenure = null;
      await subscription.save();
    }

    return res.status(200).json({
      plan: subscription.plan,
      status: subscription.status,
      tenure: subscription.tenure,
      endDate: subscription.endDate
    });

  } catch (err) {
    console.error("Subscription fetch error:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { tenure } = req.body;
    const organizationId = req.user?.organizationId;

    if (!organizationId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    let amount = 0;
    if (tenure === 6) amount = 15000;
    else if (tenure === 12) amount = 34000;
    else {
      return res.status(400).json({ success: false, error: "Invalid tenure" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    return res.status(200).json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("Order creation error:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      tenure
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.error("Payment verification failed:", generated_signature, razorpay_signature);
      return res.status(400).json({ success: false, error: "Payment verification failed" });
    }
    console.log("Payment verification successful:", generated_signature, razorpay_signature);
    const organizationId = req.user.organizationId;

    const subscription = await Subscription.findOne({ organizationId });

    subscription.plan = "business";
    subscription.status = "active";
    subscription.tenure = `${tenure}m`;

    const now = new Date();
    subscription.startDate = now;

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + tenure);
    subscription.endDate = endDate;

    await subscription.save();

    return res.status(200).json({
      success: true,  
      message: "Subscription upgraded successfully"
    });

  }
  catch (err) {
    console.error("Payment verification error:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}