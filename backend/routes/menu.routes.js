const express = require("express");

const {
    addMenuItem,
    getMenuItems,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
    searchMenuItem
} = require("../controller/menu.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const router = express.Router();

// Add Menu Item - Admin only
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    addMenuItem
);

// Get Menu Items - Public/User/Guest
router.get(
    "/",
    getMenuItems
);

router.get(
    "/search",
    searchMenuItem
);

router.get (
    "/:id",
    getMenuItemById
);
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateMenuItem 
);
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteMenuItem
);

module.exports = router;