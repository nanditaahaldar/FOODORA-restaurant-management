const express = require("express");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controller/order.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const router = express.Router();


// ==========================================
// CUSTOMER ROUTES
// ==========================================

// Place an order
router.post("/", authMiddleware, createOrder);

// Get logged-in user's orders
router.get("/my-orders", authMiddleware, getMyOrders);


// ==========================================
// ADMIN ROUTES
// ==========================================

// Get all orders
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

// Update order status
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);


module.exports = router;