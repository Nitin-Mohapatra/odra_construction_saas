const express = require("express");
const router = express.Router();

const { getAdminDashboard, getUserGrowth, getRevenueGrowth, getSubscriptionStats } = require("../controllers/adminDashboardController");

const { authen } = require("../middleware/tokenValidatorsMiddleware");
const { validateRoles } = require("../middleware/roles");

router.get(
    "/dashboard",
    authen,
    validateRoles(["admin"]),
    getAdminDashboard
);

router.get(
    "/user-growth",
    authen,
    validateRoles(["admin"]),
    getUserGrowth
);

router.get(
    "/revenue-growth",
    authen,
    validateRoles(["admin"]),
    getRevenueGrowth
);

router.get(
    "/subscription-stats",
    authen,
    validateRoles(["admin"]),
    getSubscriptionStats
);

module.exports = router;