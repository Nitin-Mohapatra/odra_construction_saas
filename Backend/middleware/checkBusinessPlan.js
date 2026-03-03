const Subscription = require("../models/Subscription");

const checkBusinessPlan = async (req, res, next) => {
    try {
        const organizationId = req.user.organizationId;

        const subscription = await Subscription.findOne({ organizationId });

        if (!subscription) {
            return res.status(403).json({
                success: false,
                error: "Subscription not found"
            });
        }

        if (subscription.plan !== "business") {
            return res.status(403).json({
                success: false,
                error: "This feature is available only in Business plan."
            });
        }

        if (subscription.status !== "active") {
            return res.status(403).json({
                success: false,
                error: "Your subscription has expired."
            });
        }

        next();
    } catch (error) {
        console.error("Subscription middleware error:", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};

module.exports = checkBusinessPlan;