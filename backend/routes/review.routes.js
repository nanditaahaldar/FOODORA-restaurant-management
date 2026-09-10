const express = require("express");

const router = express.Router();

const {
  addReview,
  getMenuItemReviews,
} = require("../controller/review.controller");

const authMiddleware = require("../middleware/auth.middleware");

// ======================================================
// ADD REVIEW
// ======================================================

router.post("/", authMiddleware, addReview);

// ======================================================
// GET REVIEWS FOR A MENU ITEM
// ======================================================

router.get("/:menuItemId", getMenuItemReviews);

module.exports = router;