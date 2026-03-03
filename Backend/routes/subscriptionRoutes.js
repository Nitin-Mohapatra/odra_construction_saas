const express = require("express");
const router = express.Router();
const { getMySubscription , createOrder , verifyPayment } = require("../controllers/subscriptionController");
const { authen } = require("../middleware/tokenValidatorsMiddleware");

router.get("/me", authen, getMySubscription);
router.post("/create-order", authen, createOrder);
router.post("/verify-payment", authen, verifyPayment);

module.exports = router;