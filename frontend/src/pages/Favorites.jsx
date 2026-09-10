import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { Heart, ShoppingBag } from "lucide-react";

import API from "../services/api";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ======================================================
  // GET FAVORITE FOODS
  // ======================================================

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your favorites.");
        setLoading(false);
        return;
      }

      try {
        const response = await API.get(
          "/users/favorites",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFavorites(
          response.data.favorites || []
        );
      } catch (error) {
        console.error(
          "Failed to load favorites:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load favorites."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // ======================================================
  // REMOVE FAVORITE
  // ======================================================

  const handleRemoveFavorite = async (menuItemId) => {
    const token = localStorage.getItem("token");

    try {
      await API.put(
        `/users/favorites/${menuItemId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove from the page immediately
      setFavorites((previous) =>
        previous.filter(
          (item) => item._id !== menuItemId
        )
      );
    } catch (error) {
      console.error(
        "Failed to remove favorite:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove favorite."
      );
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="favorites-page">
        <div className="favorites-empty">
          <h2>Loading favorites...</h2>
        </div>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div className="favorites-page">
        <div className="favorites-empty">
          <Heart size={55} />

          <h2>{error}</h2>

          <Link
            to="/login"
            className="favorites-login-btn"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="favorites-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="favorites-header">

        <p className="section-subtitle">
          YOUR COLLECTION
        </p>

        <h1>
          My Favorite Foods
        </h1>

        <p>
          Your favorite dishes, all in one place.
        </p>

      </div>

      {/* ==================================================
          EMPTY FAVORITES
      ================================================== */}

      {favorites.length === 0 ? (
        <div className="favorites-empty">

          <Heart size={60} />

          <h2>
            No favorites yet
          </h2>

          <p>
            Start adding your favorite dishes
            from our menu.
          </p>

          <Link
            to="/menu"
            className="browse-menu-btn"
          >
            Browse Menu
          </Link>

        </div>
      ) : (

        /* ==================================================
           FAVORITES GRID
        ================================================== */

        <div className="favorites-grid">

          {favorites.map((item) => (

            <div
              className="favorite-card"
              key={item._id}
            >

              {/* IMAGE */}

              <div className="favorite-image">

                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                ) : (
                  <span>🍽️</span>
                )}

                {/* REMOVE HEART */}

                <button
                  type="button"
                  className="favorite-remove-btn"
                  onClick={() =>
                    handleRemoveFavorite(item._id)
                  }
                  aria-label="Remove from favorites"
                >
                  <Heart
                    size={21}
                    fill="currentColor"
                  />
                </button>

              </div>

              {/* CONTENT */}

              <div className="favorite-card-content">

                <p className="favorite-category">
                  {item.category}
                </p>

                <h2>
                  {item.name}
                </h2>

                <p className="favorite-description">
                  {item.description}
                </p>

                {/* PRICE */}

                <div className="favorite-bottom">

                  <span className="favorite-price">
                    ₹{item.price}
                  </span>

                  <Link
                    to={`/menu/${item._id}`}
                    className="favorite-view-btn"
                  >
                    View Details
                  </Link>

                </div>

                {/* AVAILABILITY */}

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

          ))}

        </div>
      )}

    </div>
  );
}

export default Favorites;