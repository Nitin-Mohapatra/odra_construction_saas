const admin = require("../utils/firebase");

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
        return await admin.messaging().send(message);
    } catch (err) {
        console.error("FCM sendToUser Error:", err);
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
        return await admin.messaging().sendEachForMulticast(message);
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