const Review = require("../model/review.model");
const Order = require("../model/order.model");

// ======================================================
// ADD REVIEW
// ======================================================

const addReview = async (req, res) => {
  try {
    const { menuItem, rating, comment } = req.body;

    // Check required fields
    if (!menuItem || !rating || !comment) {
      return res.status(400).json({
        message: "Menu item, rating and comment are required",
      });
    }

    // Check rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // Check whether user has ordered this item
    const order = await Order.findOne({
      user: req.user.id,
      "items.menuItem": menuItem,
    });

    if (!order) {
      return res.status(403).json({
        message: "You can review only items you have ordered",
      });
    }

    // Check if user already reviewed this item
    const existingReview = await Review.findOne({
      user: req.user.id,
      menuItem,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this item",
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      menuItem,
      rating,
      comment,
    });

    // Return review with user information
    const populatedReview = await Review.findById(review._id)
      .populate("user", "name");

    res.status(201).json({
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("Add review error:", error);

    res.status(500).json({
      message: "Failed to add review",
      error: error.message,
    });
  }
};

// ======================================================
// GET REVIEWS FOR A MENU ITEM
// ======================================================

const getMenuItemReviews = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const reviews = await Review.find({
      menuItem: menuItemId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    // Calculate average rating
    let averageRating = 0;

    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );

      averageRating = totalRating / reviews.length;
    }

    res.status(200).json({
      reviews,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    res.status(500).json({
      message: "Failed to get reviews",
      error: error.message,
    });
  }
};

module.exports = {
  addReview,
  getMenuItemReviews,
};