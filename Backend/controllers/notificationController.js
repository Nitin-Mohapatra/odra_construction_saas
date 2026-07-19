const User = require("../models/user");

exports.saveFCMToken = async (req, res) => {
    try {
        const { fcmToken } = req.body;
        if (!fcmToken) {
            return res.status(400).json({
                success: false,
                message: "FCM token is required"
            });
        }
        await User.findByIdAndUpdate(
            req.user.User_id,
            {
                fcmToken
            }
        );
        return res.status(200).json({
            success: true,
            message: "FCM Token Saved Successfully"
        });

    } catch (err) {
        console.error("Save FCM Token Error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};