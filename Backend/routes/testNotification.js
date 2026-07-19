const express = require("express");
const router = express.Router();

const User = require("../models/user");
const { sendToUser } = require("../services/notification.service");

router.get("/test", async (req, res) => {

    try {

        const user = await User.findOne({
            email: "nitinmohapatra26@gmail.com"
        });

        if (!user || !user.fcmToken) {
            return res.status(404).json({
                message: "User or FCM Token not found"
            });
        }

        await sendToUser({

            token: user.fcmToken,

            title: "ODRAOPS",

            body: "Congratulations 🎉 Your first notification works!",

            data: {
                type: "test"
            }

        });

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});

module.exports = router;