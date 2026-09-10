const express = require("express");

const {
    getDashboard
} = require("../controller/dashboard.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const router = express.Router();

// Dashboard - Admin only
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getDashboard
);

module.exports = router;