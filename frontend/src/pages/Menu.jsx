import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { Heart } from "lucide-react";

import API from "../services/api";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ❤️ Store favorite menu item IDs
  const [favorites, setFavorites] = useState([]);

  // ======================================================
  // GET MENU ITEMS + FAVORITES
  // ======================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get menu items
        const menuResponse = await API.get("/menu");

        const items = menuResponse.data.menuItems || [];

        // Fetch reviews for every menu item
        const itemsWithRatings = await Promise.all(
          items.map(async (item) => {
            try {
              const reviewResponse = await API.get(
                `/reviews/${item._id}`
              );

              return {
                ...item,
                averageRating:
                  reviewResponse.data.averageRating || 0,
                totalReviews:
                  reviewResponse.data.totalReviews || 0,
              };
            } catch (reviewError) {
              console.error(
                `Failed to load reviews for ${item.name}:`,
                reviewError
              );

              return {
                ...item,
                averageRating: 0,
                totalReviews: 0,
              };
            }
          })
        );

        setMenuItems(itemsWithRatings);

        // ==================================================
        // GET USER FAVORITES
        // ==================================================

        const token = localStorage.getItem("token");

        if (token) {
          try {
            const favoriteResponse = await API.get(
              "/users/favorites",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const favoriteItems =
              favoriteResponse.data.favorites || [];

            const favoriteIds = favoriteItems.map(
              (item) => item._id
            );

            setFavorites(favoriteIds);
          } catch (favoriteError) {
            console.error(
              "Failed to load favorites:",
              favoriteError
            );
          }
        }
      } catch (error) {
        console.error(error);

        setError("Failed to load menu items.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ======================================================
  // TOGGLE FAVORITE
  // ======================================================

  const handleFavorite = async (menuItemId) => {
    const token = localStorage.getItem("token");

    // User must login to use favorites
    if (!token) {
      alert("Please login to add favorites.");
      return;
    }

    try {
      const response = await API.put(
        `/users/favorites/${menuItemId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const isFavorite = response.data.isFavorite;

      if (isFavorite) {
        // Add to favorites
        setFavorites((previous) => [
          ...previous,
          menuItemId,
        ]);
      } else {
        // Remove from favorites
        setFavorites((previous) =>
          previous.filter(
            (id) => id !== menuItemId
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to update favorite:",
        error
      );

      if (error.response?.status === 401) {
        alert("Please login to use favorites.");
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to update favorite."
        );
      }
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <h2 className="loading">
        Loading menu...
      </h2>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <h2 className="error">
        {error}
      </h2>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="menu-page">

      {/* ======================================================
          MENU HEADER
      ====================================================== */}

      <div className="menu-header">

        <p className="section-subtitle">
          OUR MENU
        </p>

        <h1>
          Discover Our Delicious Food
        </h1>

        <p>
          Explore our selection of delicious dishes
          prepared with fresh ingredients.
        </p>

      </div>

      {/* ======================================================
          EMPTY MENU
      ====================================================== */}

      {menuItems.length === 0 ? (
        <p className="empty-menu">
          No menu items available.
        </p>
      ) : (

        /* ======================================================
           MENU GRID
        ====================================================== */

        <div className="menu-grid">

          {menuItems.map((item) => {

            const isFavorite = favorites.includes(
              item._id
            );

            return (
              <div
                className="menu-card"
                key={item._id}
              >

                {/* ==================================================
                    IMAGE
                ================================================== */}

                <div className="menu-image">

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <span>🍽️</span>
                  )}

                  {/* ==================================================
                      FAVORITE BUTTON
                  ================================================== */}

                  <button
                    type="button"
                    className={`favorite-button ${
                      isFavorite
                        ? "favorite-active"
                        : ""
                    }`}
                    onClick={() =>
                      handleFavorite(item._id)
                    }
                    aria-label={
                      isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <Heart
                      size={21}
                      fill={
                        isFavorite
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>

                </div>

                {/* ==================================================
                    CARD CONTENT
                ================================================== */}

                <div className="menu-card-content">

                  {/* Category */}

                  <p className="menu-category">
                    {item.category}
                  </p>

                  {/* Name */}

                  <h2>
                    {item.name}
                  </h2>

                  {/* Description */}

                  <p className="menu-description">
                    {item.description}
                  </p>

                  {/* ==================================================
                      RATING
                  ================================================== */}

                  <div className="menu-card-rating">

                    {item.totalReviews > 0 ? (
                      <>
                        <span className="menu-rating-stars">

                          {"★".repeat(
                            Math.round(
                              item.averageRating
                            )
                          )}

                          {"☆".repeat(
                            5 -
                              Math.round(
                                item.averageRating
                              )
                          )}

                        </span>

                        <strong>
                          {item.averageRating.toFixed(1)}
                        </strong>

                        <span className="menu-review-count">
                          ({item.totalReviews})
                        </span>
                      </>
                    ) : (
                      <span className="no-rating">
                        No reviews yet
                      </span>
                    )}

                  </div>

                  {/* ==================================================
                      PRICE + VIEW DETAILS
                  ================================================== */}

                  <div className="menu-card-bottom">

                    <span className="menu-price">
                      ₹{item.price}
                    </span>

                    <Link
                      to={`/menu/${item._id}`}
                      className="view-button"
                    >
                      View Details
                    </Link>

                  </div>

                  {/* ==================================================
                      AVAILABILITY
                  ================================================== */}

                  <p
                    className={
                      item.availability === "In Stock"
                        ? "available"
                        : "unavailable"
                    }
                  >
                    {item.availability}
                  </p>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Menu;