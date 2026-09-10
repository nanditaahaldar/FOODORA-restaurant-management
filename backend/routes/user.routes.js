const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  toggleFavorite,
  getMyFavorites
} = require("../controller/user.controller");

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");


// ==========================================
// USER PROFILE
// ==========================================

// Get logged-in user's profile
router.get(
  "/profile",
  authMiddleware,
  getMyProfile
);

// Update logged-in user's profile
router.put(
  "/profile",
  authMiddleware,
  updateMyProfile
);


// ==========================================
// ADMIN USER MANAGEMENT
// ==========================================

// View all users - Admin only
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

// Delete user - Admin only
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);

router.get(
  "/favorites",
  authMiddleware,
  getMyFavorites
);

router.put(
  "/favorites/:menuItemId",
  authMiddleware,
  toggleFavorite
);


module.exports = router;