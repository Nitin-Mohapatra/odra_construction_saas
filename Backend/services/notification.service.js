const admin = require("../utils/firebase");
const User = require("../models/user");

const buildDataPayload = (data = {}) => {
    return Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key]);
        return acc;
    }, {});
};

/*Send notification to a single user*/
const sendToUser = async ({
    token,
    title,
    body,
    data = {}
}) => {

    if (!token) return;
    try {
        const message = {
            token,
            notification: {
                title,
                body
            },
            data: buildDataPayload(data)
        };
        console.log("FCM Not sent")
        return await admin.messaging().send(message);
    } catch (err) {
        console.error("FCM sendToUser Error:", err.code);
        if (
            err.code === "messaging/registration-token-not-registered" ||
            err.code === "messaging/invalid-registration-token"
        ) {
            console.log("Removing invalid FCM Token...");
            await User.updateOne(
                { fcmToken: token },
                {
                    $set: {
                        fcmToken: null
                    }
                }
            );

        }

    }
};

/*Send notification to multiple users*/
const sendToUsers = async ({
    tokens = [],
    title,
    body,
    data = {}
}) => {

    try {
        const validTokens = tokens.filter(Boolean);
        if (!validTokens.length) return;
        const message = {
            notification: {
                title,
                body
            },
            data: buildDataPayload(data),
            tokens: validTokens
        };
        const response = await admin.messaging().sendEachForMulticast(message);
        const invalidTokens = [];
        response.responses.forEach((resp, index) => {

            if (!resp.success) {
                const code = resp.error?.code;
                if (
                    code === "messaging/registration-token-not-registered" ||
                    code === "messaging/invalid-registration-token"
                ) {
                    invalidTokens.push(validTokens[index]);
                }
            }

        });

        if (invalidTokens.length) {
            await User.updateMany(
                {
                    fcmToken: {
                        $in: invalidTokens
                    }
                },
                {
                    $set: {
                        fcmToken: null
                    }
                }
            );

        }
        return response;
        
    } catch (err) {
        console.error("FCM sendToUsers Error:", err);
    }

};

/*Broadcast notification using Topic*/
const sendToTopic = async ({
    topic,
    title,
    body,
    data = {}
}) => {
    try {
        const message = {
            topic,
            notification: {
                title,
                body
            },
            data: buildDataPayload(data)
        };
        return await admin.messaging().send(message);
    } catch (err) {
        console.error("FCM sendToTopic Error:", err);
    }

};

module.exports = {
    sendToUser,
    sendToUsers,
    sendToTopic
};