import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Clock,
} from "lucide-react";

import API from "../services/api";

import "./MyOrders.css";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // GET MY ORDERS
  // ======================================================

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
         setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await API.get(
          "/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "MY ORDERS FULL DATA:",
          JSON.stringify(
            response.data.orders,
            null,
            2
          )
        );

        setOrders(
          response.data.orders || []
        );
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error
        );

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="my-orders-container">
          <div className="orders-loading">
            <div className="loading-spinner"></div>

            <p>
              Loading your orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // NO ORDERS
  // ======================================================

  if (orders.length === 0) {
    return (
      <div className="my-orders-page">
        <div className="my-orders-container">

          <div className="orders-page-header">
            <div>
              <p className="section-subtitle">
                FoodAura
              </p>

              <h1>
                My Orders
              </h1>

              <p>
                Track and manage all your previous orders.
              </p>
            </div>
          </div>

          <div className="no-orders">

            <div className="no-orders-icon">
              <ShoppingBag size={48} />
            </div>

            <h2>
              No orders yet
            </h2>

            <p>
              Looks like you haven't ordered anything yet.
              Let's find something delicious!
            </p>

            <button
              onClick={() => navigate("/menu")}
              className="browse-menu-button"
            >
              Browse Menu
            </button>

          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // ORDERS PAGE
  // ======================================================

  return (
    <div className="my-orders-page">

      <div className="my-orders-container">

        {/* PAGE HEADER */}

        <div className="orders-page-header">

          <div>

            <p className="section-subtitle">
              FoodAura
            </p>

            <h1>
              My Orders
            </h1>

            <p>
              Track and manage all your previous orders.
            </p>

          </div>

          <div className="orders-count">

            <ShoppingBag size={18} />

            <span>
              {orders.length}{" "}
              {orders.length === 1
                ? "Order"
                : "Orders"}
            </span>

          </div>

        </div>

        {/* ORDERS */}

        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order._id}
            >

              {/* ==================================================
                  ORDER HEADER
              ================================================== */}

              <div className="order-card-header">

                <div className="order-heading">

                  <div className="order-icon">
                    <ShoppingBag size={20} />
                  </div>

                  <div>

                    <h2>
                      Order #
                      {order._id
                        ?.slice(-6)
                        .toUpperCase()}
                    </h2>

                    <p className="order-date">

                      <Clock size={14} />

                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleString()
                        : "Date unavailable"}

                    </p>

                  </div>

                </div>

                <span
                  className={`order-status ${
                    order.status
                      ?.toLowerCase()
                      .replace(/\s+/g, "-")
                  }`}
                >
                  {order.status}
                </span>

              </div>

              {/* ==================================================
                  ORDER ITEMS
              ================================================== */}

              <div className="order-items">

                {order.items?.map(
                  (item, index) => {

                    /*
                     * IMPORTANT:
                     *
                     * New orders:
                     * item.name
                     * item.image
                     * item.category
                     *
                     * Populated old orders:
                     * item.menuItem.name
                     * item.menuItem.image
                     * item.menuItem.category
                     *
                     * We support BOTH.
                     */

                    const foodName =
                      item.name ||
                      item.menuItem?.name ||
                      "Menu Item";

                    const foodImage =
                      item.image ||
                      item.menuItem?.image ||
                      "";

                    const foodCategory =
                      item.category ||
                      item.menuItem?.category ||
                      "";

                    const itemPrice =
                      Number(
                        item.price || 0
                      );

                    const quantity =
                      Number(
                        item.quantity || 0
                      );

                    const itemTotal =
                      itemPrice * quantity;

                    return (

                      <div
                        className="order-item"
                        key={
                          item._id ||
                          index
                        }
                      >

                        {/* ==================================================
                            FOOD IMAGE
                        ================================================== */}

                        <div className="order-item-image-container">

                          {foodImage ? (

                            <img
                              src={foodImage}
                              alt={foodName}
                              className="order-item-image"

                              onError={(e) => {

                                console.error(
                                  "Food image failed to load:",
                                  foodImage
                                );

                                e.currentTarget.style.display =
                                  "none";

                                const fallback =
                                  e.currentTarget
                                    .parentElement
                                    ?.querySelector(
                                      ".image-fallback"
                                    );

                                if (fallback) {
                                  fallback.style.display =
                                    "flex";
                                }

                              }}
                            />

                          ) : null}

                          {/* FALLBACK */}

                          <div
                            className="image-fallback"

                            style={{
                              display:
                                foodImage
                                  ? "none"
                                  : "flex",
                            }}
                          >
                            🍽️
                          </div>

                        </div>

                        {/* ==================================================
                            FOOD DETAILS
                        ================================================== */}

                        <div className="order-item-details">

                          <h3>
                            {foodName}
                          </h3>

                          {foodCategory && (
                            <span className="item-category">
                              {foodCategory}
                            </span>
                          )}

                          <p>
                            ₹
                            {itemPrice.toFixed(2)}
                            {" × "}
                            {quantity}
                          </p>

                        </div>

                        {/* ==================================================
                            ITEM TOTAL
                        ================================================== */}

                        <div className="order-item-total">

                          ₹
                          {itemTotal.toFixed(2)}

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

              {/* ==================================================
                  DELIVERY DETAILS
              ================================================== */}

              <div className="delivery-section">

                <div className="section-title">

                  <MapPin size={19} />

                  <h3>
                    Delivery Details
                  </h3>

                </div>

                <div className="delivery-info">

                  <div className="customer-name">
                    {order.customer?.name ||
                      "N/A"}
                  </div>

                  <div>
                    {order.customer?.phone ||
                      "N/A"}
                  </div>

                  <div>
                    {order.customer?.address ||
                      "N/A"}
                  </div>

                  <div>
                    {order.customer?.city ||
                      "N/A"}

                    {order.customer?.pincode
                      ? ` - ${order.customer.pincode}`
                      : ""}
                  </div>

                </div>

              </div>

              {/* ==================================================
                  ORDER FOOTER
              ================================================== */}

              <div className="order-footer">

                <div className="payment-info">

                  <CreditCard size={17} />

                  <span>
                    Payment:{" "}

                    <strong>
                      {order.paymentMethod ||
                        "N/A"}
                    </strong>
                  </span>

                </div>

                <div className="order-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    ₹
                    {Number(
                      order.totalAmount || 0
                    ).toFixed(2)}
                  </strong>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default MyOrders;