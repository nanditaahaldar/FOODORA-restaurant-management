import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";

import API from "../services/api";

import "./MenuDetails.css";

function MenuDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ======================================================
  // STATES
  // ======================================================

  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartMessage, setCartMessage] = useState("");

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // ======================================================
  // GET CURRENT USER ID
  // ======================================================

  const getUserId = () => {
    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        const user = JSON.parse(savedUser);

        return (
          user._id ||
          user.id ||
          user.userId ||
          null
        );
      }
    } catch (error) {
      console.error("Error reading user:", error);
    }

    // Fallback: get ID from JWT
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      return (
        payload.id ||
        payload.userId ||
        payload._id ||
        null
      );
    } catch (error) {
      console.error("Error reading token:", error);
      return null;
    }
  };

  // ======================================================
  // GET MENU ITEM
  // ======================================================

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);

        const response = await API.get(`/menu/${id}`);

        setMenuItem(
          response.data.menuItem || response.data
        );
      } catch (error) {
        console.error(
          "Error fetching menu item:",
          error
        );

        alert("Failed to load menu item.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

  // ======================================================
  // GET REVIEWS
  // ======================================================

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await API.get(
          `/reviews/${id}`
        );

        setReviews(response.data.reviews || []);
        setAverageRating(
          response.data.averageRating || 0
        );
        setTotalReviews(
          response.data.totalReviews || 0
        );
      } catch (error) {
        console.error(
          "Failed to fetch reviews:",
          error
        );
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  // ======================================================
  // ADD TO CART
  // ======================================================

  const handleAddToCart = () => {
    // Check login
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add items to cart.");
      navigate("/login");
      return;
    }

    // Get current user's ID
    const userId = getUserId();

    if (!userId) {
      alert(
        "User information not found. Please login again."
      );
      return;
    }

    if (!menuItem) {
      alert("Menu item not available.");
      return;
    }

    // Each user has a separate cart
    const cartKey = `cart_${userId}`;

    // Get existing cart
    let existingCart = [];

    try {
      existingCart = JSON.parse(
        localStorage.getItem(cartKey) || "[]"
      );

      if (!Array.isArray(existingCart)) {
        existingCart = [];
      }
    } catch (error) {
      console.error(
        "Error reading cart:",
        error
      );

      existingCart = [];
    }

    // Check if item already exists
    const existingItem = existingCart.find(
      (item) => item._id === menuItem._id
    );

    let updatedCart;

    if (existingItem) {
      // Increase quantity
      updatedCart = existingCart.map((item) =>
        item._id === menuItem._id
          ? {
              ...item,
              quantity:
                Number(item.quantity || 1) + 1,
            }
          : item
      );
    } else {
      // Add new item
      updatedCart = [
        ...existingCart,
        {
          ...menuItem,
          quantity: 1,
        },
      ];
    }

    // Save cart for this user
    localStorage.setItem(
      cartKey,
      JSON.stringify(updatedCart)
    );

    console.log("Cart saved:", updatedCart);
    console.log("Cart key:", cartKey);

    // Show green success message
    setCartMessage("Item added to cart!");

    // Remove message after 3 seconds
    setTimeout(() => {
      setCartMessage("");
    }, 3000);
  };

  // ======================================================
  // SUBMIT REVIEW
  // ======================================================

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // User must be logged in
    if (!token) {
      alert("Please login to write a review.");
      navigate("/login");
      return;
    }

    // Check comment
    if (!comment.trim()) {
      setReviewMessage(
        "Please write a comment."
      );
      return;
    }

    try {
      setReviewLoading(true);
      setReviewMessage("");

      const response = await API.post(
        "/reviews",
        {
          menuItem: id,
          rating: Number(rating),
          comment: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add new review at the beginning
      setReviews((prev) => [
        response.data.review,
        ...prev,
      ]);

      // Calculate new average rating
      const oldTotal =
        averageRating * totalReviews;

      const newTotalReviews =
        totalReviews + 1;

      const newAverage =
        (oldTotal + Number(rating)) /
        newTotalReviews;

      setTotalReviews(newTotalReviews);
      setAverageRating(
        Number(newAverage.toFixed(1))
      );

      // Reset form
      setRating(5);
      setComment("");

      setReviewMessage(
        "Review added successfully! ⭐"
      );
    } catch (error) {
      console.error(
        "Review error:",
        error
      );

      setReviewMessage(
        error.response?.data?.message ||
          "Failed to add review."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="menu-details-page">
        <div className="menu-details-container">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // ======================================================
  // ITEM NOT FOUND
  // ======================================================

  if (!menuItem) {
    return (
      <div className="menu-details-page">
        <div className="menu-details-container">
          <h2>Menu item not found</h2>

          <button
            onClick={() => navigate("/menu")}
            className="back-button"
          >
            <ArrowLeft size={18} />
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="menu-details-page">
      <div className="menu-details-container">

        {/* Back Button */}

        <button
          onClick={() => navigate("/menu")}
          className="back-button"
        >
          <ArrowLeft size={18} />
          Back to Menu
        </button>

        {/* ======================================================
            PRODUCT DETAILS
        ====================================================== */}

        <div className="menu-details-card">

          {/* Image */}

          <div className="menu-details-image-container">
            {menuItem.image ? (
              <img
                src={menuItem.image}
                alt={menuItem.name}
                className="menu-details-image"
              />
            ) : (
              <div className="menu-details-no-image">
                No Image
              </div>
            )}
          </div>

          {/* Information */}

          <div className="menu-details-info">

            {/* Category */}

            <span className="menu-details-category">
              {menuItem.category}
            </span>

            {/* Name */}

            <h1>{menuItem.name}</h1>

            {/* Description */}

            {menuItem.description && (
              <p className="menu-details-description">
                {menuItem.description}
              </p>
            )}

            {/* ======================================================
                RATING SUMMARY
            ====================================================== */}

            <div className="rating-summary">
              <span className="rating-stars">
                {averageRating > 0
                  ? "★".repeat(
                      Math.round(averageRating)
                    )
                  : "☆☆☆☆☆"}
              </span>

              <strong>
                {averageRating.toFixed(1)} / 5
              </strong>

              <span>
                (
                {totalReviews}{" "}
                {totalReviews === 1
                  ? "review"
                  : "reviews"}
                )
              </span>
            </div>

            {/* Price */}

            <h2 className="menu-details-price">
              ₹{menuItem.price}
            </h2>

            {/* Availability */}

            <p className="menu-details-availability">
              Availability:{" "}
              <strong>
                {menuItem.availability ||
                  "In Stock"}
              </strong>
            </p>

            {/* Add To Cart */}

            <button
              onClick={handleAddToCart}
              className="add-to-cart-button"
              disabled={
                menuItem.availability &&
                menuItem.availability !==
                  "In Stock"
              }
            >
              <ShoppingCart size={20} />

              {menuItem.availability &&
              menuItem.availability !==
                "In Stock"
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

            {/* Go To Cart */}

            <button
              onClick={() => navigate("/cart")}
              className="go-to-cart-button"
            >
              Go to Cart
            </button>

            {/* Green Success Message */}

            {cartMessage && (
              <p className="cart-success-message">
                ✓ {cartMessage}
              </p>
            )}
          </div>
        </div>

        {/* ======================================================
            RATINGS & REVIEWS
        ====================================================== */}

        <section className="reviews-section">

          <h2>Ratings & Reviews</h2>

          {/* ======================================================
              REVIEW FORM
          ====================================================== */}

          <div className="review-form">

            <h3>Write a Review</h3>

            {/* Rating */}

            <div className="rating-input">
              <span>Your Rating:</span>

              <div className="star-buttons">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setRating(star)
                      }
                      className={
                        star <= rating
                          ? "active-star"
                          : ""
                      }
                    >
                      ★
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Comment */}

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
              placeholder="Write your review..."
              rows="4"
            />

            {/* Submit */}

            <button
              type="button"
              onClick={handleSubmitReview}
              disabled={reviewLoading}
              className="submit-review-button"
            >
              {reviewLoading
                ? "Submitting..."
                : "Submit Review"}
            </button>

            {/* Review Message */}

            {reviewMessage && (
              <p className="review-message">
                {reviewMessage}
              </p>
            )}
          </div>

          {/* ======================================================
              REVIEWS LIST
          ====================================================== */}

          <div className="reviews-list">

            {reviews.length === 0 ? (
              <p className="no-reviews">
                No reviews yet. Be the first to
                review this food! 🍽️
              </p>
            ) : (
              reviews.map((review) => (
                <div
                  className="review-card"
                  key={review._id}
                >
                  <div className="review-header">

                    <strong>
                      {review.user?.name ||
                        "User"}
                    </strong>

                    <span className="review-stars">
                      {"★".repeat(
                        review.rating
                      )}
                      {"☆".repeat(
                        5 - review.rating
                      )}
                    </span>
                  </div>

                  <p>{review.comment}</p>

                  <small>
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString()}
                  </small>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

export default MenuDetails;