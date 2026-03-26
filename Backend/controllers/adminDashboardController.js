const User = require("../models/user");
const Organization = require("../models/Organization");
const Subscription = require("../models/Subscription");

exports.getAdminDashboard = async (req, res) => {
    try {

        // 1️⃣ Total users
        const totalUsers = await User.countDocuments({
            "role":{
                $ne:"admin"
            }
        });

        // 2️⃣ Total organizations
        const totalOrganizations = await Organization.countDocuments();

        // 3️⃣ Active business subscriptions
        const activeSubscriptions = await Subscription.countDocuments({
            plan: "business",
            status: "active"
        });

        // 4️⃣ Revenue calculation from subscription
        const revenueData = await Subscription.aggregate([
            {
                $match: {
                    plan: "business",
                    status: "active"
                }
            },
            {
                $group: {
                    _id: "$tenure",
                    count: { $sum: 1 }
                }
            }
        ]);

        let totalRevenue = 0;

        revenueData.forEach(item => {

            if (item._id === "6m") {
                totalRevenue += item.count * 15000;
            }

            if (item._id === "12m") {
                totalRevenue += item.count * 34000;
            }

        });

        return res.status(200).json({
            success: true,
            totalUsers,
            totalOrganizations,
            activeSubscriptions,
            totalRevenue
        });

    } catch (error) {

        console.error("Admin dashboard error:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });

    }

};

exports.getUserGrowth = async (req, res) => {

    try {

        const growth = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    users: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        const monthNames = [
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec"
        ];

        const usersByMonth = {};

        growth.forEach(item => {
            usersByMonth[item._id] = item.users;
        });

        const formatted = [];

        for (let i = 1; i <= 12; i++) {
            formatted.push({
                month: monthNames[i - 1],
                users: usersByMonth[i] || 0
            });
        }

        return res.status(200).json({
            success: true,
            data: formatted
        });

    } catch (error) {

        console.error("User growth error:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });

    }

};

exports.getRevenueGrowth = async (req, res) => {

    try {

        const revenueData = await Subscription.aggregate([
            {
                $match: {
                    plan: "business",
                    status: "active"
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        tenure: "$tenure"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.month": 1 }
            }
        ]);

        const monthNames = [
            "Jan","Feb","Mar","Apr","May","Jun",
            "Jul","Aug","Sep","Oct","Nov","Dec"
        ];

        const revenueByMonth = {};

        revenueData.forEach(item => {

            const month = item._id.month;
            const tenure = item._id.tenure;
            const count = item.count;

            let revenue = 0;

            if (tenure === "6m") {
                revenue = count * 15000;
            }

            if (tenure === "12m") {
                revenue = count * 34000;
            }

            if (!revenueByMonth[month]) {
                revenueByMonth[month] = 0;
            }

            revenueByMonth[month] += revenue;

        });

        const formatted = [];

        for (let i = 1; i <= 12; i++) {
            formatted.push({
                month: monthNames[i - 1],
                revenue: revenueByMonth[i] || 0
            });
        }

        return res.status(200).json({
            success: true,
            data: formatted
        });

    } catch (error) {

        console.error("Revenue growth error:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });

    }

};

exports.getSubscriptionStats = async (req, res) => {

    try {

        const stats = await Subscription.aggregate([
            {
                $group: {
                    _id: {
                        plan: "$plan",
                        tenure: "$tenure"
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        let freeUsers = 0;
        let business6m = 0;
        let business12m = 0;

        stats.forEach(item => {

            const plan = item._id.plan;
            const tenure = item._id.tenure;

            if (plan === "free") {
                freeUsers += item.count;
            }

            if (plan === "business" && tenure === "6m") {
                business6m += item.count;
            }

            if (plan === "business" && tenure === "12m") {
                business12m += item.count;
            }

        });

        const businessTotal = business6m + business12m;

        return res.status(200).json({
            success: true,
            data: {
                freeUsers,
                businessTotal,
                business6m,
                business12m
            }
        });

    } catch (error) {

        console.error("Subscription stats error:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });

    }

};