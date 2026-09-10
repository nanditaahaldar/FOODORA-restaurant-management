import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";
import "./Cart.css";

// ======================================================
// GET LOGGED-IN USER ID
// ======================================================

const getUserId = () => {
  // First try the saved user object
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
    console.error(
      "Error reading user:",
      error
    );
  }

  // If user object doesn't contain ID,
  // try getting it from JWT
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
    console.error(
      "Error reading token:",
      error
    );

    return null;
  }
};

// ======================================================
// CART COMPONENT
// ======================================================

function Cart() {
  const navigate = useNavigate();

  // ======================================================
  // CHECK LOGIN
  // ======================================================

  const token = localStorage.getItem("token");

  // Get current user's ID
  const userId = getUserId();

  // Create a unique cart key for this user
  const cartKey = userId
    ? `cart_${userId}`
    : null;

  // ======================================================
  // LOAD USER-SPECIFIC CART
  // ======================================================

  const [cart, setCart] = useState(() => {
    // User must be logged in
    if (!token || !userId) {
      return [];
    }

    const savedCart = localStorage.getItem(
      `cart_${userId}`
    );

    if (!savedCart) {
      return [];
    }

    try {
      const parsedCart = JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        return parsedCart;
      }

      return [];
    } catch (error) {
      console.error(
        "Invalid cart data:",
        error
      );

      return [];
    }
  });

  // ======================================================
  // IF USER IS NOT LOGGED IN
  // ======================================================

  if (!token || !userId) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <ShoppingCart size={65} />
          </div>

          <h1>Please Login</h1>

          <p>
            Please login to view your cart.
          </p>

          <button
            type="button"
            className="browse-menu-btn"
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ======================================================
  // UPDATE CART
  // ======================================================

  const updateCart = (updatedCart) => {
    setCart(updatedCart);

    // Save cart ONLY for this user
    localStorage.setItem(
      cartKey,
      JSON.stringify(updatedCart)
    );
  };

  // ======================================================
  // INCREASE QUANTITY
  // ======================================================

  const increaseQuantity = (id) => {
    const updatedCart = cart.map(
      (item) => {
        if (item._id === id) {
          return {
            ...item,
            quantity:
              Number(item.quantity || 1) + 1,
          };
        }

        return item;
      }
    );

    updateCart(updatedCart);
  };

  // ======================================================
  // DECREASE QUANTITY
  // ======================================================

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) => {
        if (item._id === id) {
          return {
            ...item,
            quantity:
              Number(item.quantity || 1) - 1,
          };
        }

        return item;
      })
      .filter(
        (item) =>
          Number(item.quantity || 0) > 0
      );

    updateCart(updatedCart);
  };

  // ======================================================
  // REMOVE ITEM
  // ======================================================

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item._id !== id
    );

    updateCart(updatedCart);
  };

  // ======================================================
  // CLEAR CART
  // ======================================================

  const clearCart = () => {
    setCart([]);

    // Remove ONLY current user's cart
    localStorage.removeItem(cartKey);
  };

  // ======================================================
  // TOTAL ITEMS
  // ======================================================

  const totalItems = cart.reduce(
    (total, item) =>
      total +
      Number(item.quantity || 1),
    0
  );

  // ======================================================
  // SUBTOTAL
  // ======================================================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity || 1),
    0
  );

  // ======================================================
  // DELIVERY CHARGE
  // ======================================================

  const deliveryCharge = 0;

  // ======================================================
  // FINAL TOTAL
  // ======================================================

  const total =
    subtotal + deliveryCharge;

  // ======================================================
  // EMPTY CART
  // ======================================================

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">

          <div className="empty-cart-icon">
            <ShoppingCart size={65} />
          </div>

          <h1>Your Cart is Empty</h1>

          <p>
            Looks like you haven't added
            anything to your cart yet.
          </p>

          <Link
            to="/menu"
            className="browse-menu-btn"
          >
            Browse Menu
          </Link>

        </div>
      </div>
    );
  }

  // ======================================================
  // CART PAGE
  // ======================================================

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* ===============================
            PAGE HEADER
        =============================== */}

        <div className="cart-header">

          <div>
            <h1>Your Cart</h1>

            <p>
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}{" "}
              in your cart
            </p>
          </div>

          <button
            type="button"
            className="clear-cart-btn"
            onClick={clearCart}
          >
            Clear Cart
          </button>

        </div>

        {/* ===============================
            MAIN CONTENT
        =============================== */}

        <div className="cart-content">

          {/* =============================
              LEFT SIDE - CART ITEMS
          ============================= */}

          <div className="cart-items">

            {cart.map((item) => (

              <div
                className="cart-item"
                key={item._id}
              >

                {/* FOOD IMAGE */}

                <div className="cart-item-image">

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <div className="no-image">
                      🍽️
                    </div>
                  )}

                </div>

                {/* FOOD INFORMATION */}

                <div className="cart-item-details">

                  <h3>
                    {item.name}
                  </h3>

                  {item.category && (
                    <p className="cart-category">
                      {item.category}
                    </p>
                  )}

                  <p className="cart-unit-price">
                    ₹
                    {Number(
                      item.price
                    ).toFixed(2)}{" "}
                    each
                  </p>

                </div>

                {/* QUANTITY */}

                <div className="quantity-section">

                  <p>Quantity</p>

                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item._id
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>

                    <span>
                      {item.quantity || 1}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          item._id
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>

                  </div>

                </div>

                {/* ITEM TOTAL */}

                <div className="cart-item-total">

                  <p>Total</p>

                  <strong>
                    ₹
                    {(
                      Number(item.price) *
                      Number(
                        item.quantity || 1
                      )
                    ).toFixed(2)}
                  </strong>

                </div>

                {/* REMOVE */}

                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() =>
                    removeItem(item._id)
                  }
                  title="Remove item"
                  aria-label="Remove item"
                >
                  <Trash2 size={20} />
                </button>

              </div>

            ))}

          </div>

          {/* =============================
              RIGHT SIDE - ORDER SUMMARY
          ============================= */}

          <div className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">

              <span>
                Items
              </span>

              <span>
                {totalItems}
              </span>

            </div>

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{subtotal.toFixed(2)}
              </span>

            </div>

            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span className="free-text">
                Free
              </span>

            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹{total.toFixed(2)}
              </strong>

            </div>

            {/* CHECKOUT */}

            <button
              type="button"
              className="checkout-btn"
              onClick={() =>
                navigate("/checkout")
              }
            >
              Proceed to Checkout
            </button>

            {/* CONTINUE SHOPPING */}

            <Link
              to="/menu"
              className="continue-shopping-link"
            >
              ← Continue Shopping
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Cart;