import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import API from "../services/api";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Category filter
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  // Price/rating/availability filter
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");

  // Reference for filter container
  const filterRef = useRef(null);

  // Store favorite menu item IDs
  const [favorites, setFavorites] = useState([]);

  // ======================================================
  // GET MENU ITEMS + FAVORITES
  // ======================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get menu items
        const menuResponse = await API.get("/menu");

        const items =
          menuResponse.data.menuItems || [];

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
  // CLOSE FILTER WHEN CLICKING OUTSIDE
  // ======================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setFilterOpen(false);
      }
    };

    if (filterOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [filterOpen]);

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

      const isFavorite =
        response.data.isFavorite;

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
  // FILTER + SORT MENU ITEMS
  // ======================================================

  const filteredMenuItems = [...menuItems]
    .filter((item) => {
      // Category
      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      // Search
      const searchText =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        item.name
          ?.toLowerCase()
          .includes(searchText) ||
        item.description
          ?.toLowerCase()
          .includes(searchText) ||
        item.category
          ?.toLowerCase()
          .includes(searchText);

      return (
        matchesCategory && matchesSearch
      );
    })
    .sort((a, b) => {
      // Price: Low to High
      if (selectedSort === "price-low") {
        return (
          Number(a.price) - Number(b.price)
        );
      }

      // Price: High to Low
      if (selectedSort === "price-high") {
        return (
          Number(b.price) - Number(a.price)
        );
      }

      // Rating: Highest First
      if (selectedSort === "rating-high") {
        return (
          Number(b.averageRating || 0) -
          Number(a.averageRating || 0)
        );
      }

      // Available Items First
      if (selectedSort === "available") {
        const aAvailable =
          a.availability === "In Stock"
            ? 1
            : 0;

        const bAvailable =
          b.availability === "In Stock"
            ? 1
            : 0;

        return bAvailable - aAvailable;
      }

      return 0;
    });

  // ======================================================
  // CLEAR FILTER
  // ======================================================

  const handleClearFilter = () => {
    setSelectedSort("");
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
          SEARCH BAR
      ====================================================== */}

      <div className="menu-search">
        <Search size={20} />

        <input
          type="text"
          placeholder="Search for food..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      {/* ======================================================
          CATEGORY FILTER
      ====================================================== */}

      <div className="category-filter">
        {[
          "All",
          "Starter",
          "Main Course",
          "Dessert",
          "Beverage",
        ].map((category) => (
          <button
            key={category}
            type="button"
            className={
              selectedCategory === category
                ? "category-button active"
                : "category-button"
            }
            onClick={() =>
              setSelectedCategory(category)
            }
          >
            {category}
          </button>
        ))}
      </div>

      {/* ======================================================
          FILTER BUTTON
      ====================================================== */}

      <div
        className="menu-filter-container"
        ref={filterRef}
      >
        <button
          type="button"
          className={`menu-filter-button ${
            selectedSort
              ? "filter-active"
              : ""
          }`}
          onClick={() =>
            setFilterOpen(!filterOpen)
          }
        >
          <SlidersHorizontal size={18} />
          <span>Filter</span>
        </button>

        {/* ======================================================
            FILTER PANEL
        ====================================================== */}

        {filterOpen && (
          <div className="menu-filter-panel">

            <h3>Filter Menu</h3>

            {/* Price */}

            <div className="filter-section">
              <p>Price</p>

              <label>
                <input
                  type="radio"
                  name="sort"
                  value="price-low"
                  checked={
                    selectedSort === "price-low"
                  }
                  onChange={(e) =>
                    setSelectedSort(
                      e.target.value
                    )
                  }
                />

                Price: Low to High
              </label>

              <label>
                <input
                  type="radio"
                  name="sort"
                  value="price-high"
                  checked={
                    selectedSort === "price-high"
                  }
                  onChange={(e) =>
                    setSelectedSort(
                      e.target.value
                    )
                  }
                />

                Price: High to Low
              </label>
            </div>

            {/* Other */}

            <div className="filter-section">
              <p>Other</p>

              <label>
                <input
                  type="radio"
                  name="sort"
                  value="rating-high"
                  checked={
                    selectedSort === "rating-high"
                  }
                  onChange={(e) =>
                    setSelectedSort(
                      e.target.value
                    )
                  }
                />

                Rating: Highest First
              </label>

              <label>
                <input
                  type="radio"
                  name="sort"
                  value="available"
                  checked={
                    selectedSort === "available"
                  }
                  onChange={(e) =>
                    setSelectedSort(
                      e.target.value
                    )
                  }
                />

                Available Items First
              </label>
            </div>

            {/* Filter Actions */}

            <div className="filter-actions">

              <button
                type="button"
                className="clear-filter-button"
                onClick={handleClearFilter}
              >
                Clear
              </button>

              <button
                type="button"
                className="apply-filter-button"
                onClick={() =>
                  setFilterOpen(false)
                }
              >
                Apply
              </button>

            </div>

          </div>
        )}
      </div>

      {/* ======================================================
          EMPTY MENU
      ====================================================== */}

      {menuItems.length === 0 ? (
        <p className="empty-menu">
          No menu items available.
        </p>
      ) : filteredMenuItems.length === 0 ? (
        <p className="empty-menu">
          No food found.
        </p>
      ) : (

        /* ======================================================
           MENU GRID
        ====================================================== */

        <div className="menu-grid">

          {filteredMenuItems.map((item) => {

            const isFavorite =
              favorites.includes(item._id);

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

                  {/* Favorite Button */}

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
                          {item.averageRating.toFixed(
                            1
                          )}
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
                      item.availability ===
                      "In Stock"
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