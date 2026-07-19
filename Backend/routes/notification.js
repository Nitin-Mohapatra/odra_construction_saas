const express = require("express");
const router = express.Router();

const { authen } = require("../middleware/tokenValidatorsMiddleware");
const notificationController = require("../controllers/notificationController");

router.post(
    "/fcm-token",
    authen,
    notificationController.saveFCMToken
);

module.exports = router;