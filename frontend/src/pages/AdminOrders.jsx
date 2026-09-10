import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Clock,
  User,
  RefreshCw,
} from "lucide-react";

import API from "../services/api";
import "./AdminOrders.css";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [error, setError] = useState("");

  // ======================================================
  // FETCH ALL ORDERS
  // ======================================================
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await API.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        setError("You are not authorized to view orders.");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load orders."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOAD ORDERS WHEN PAGE OPENS
  // ======================================================
  useEffect(() => {
    fetchOrders();
  }, []);

  // ======================================================
  // UPDATE ORDER STATUS
  // ======================================================
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);

      const token = localStorage.getItem("token");

      await API.put(
        `/orders/${orderId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update status immediately in UI
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // ======================================================
  // STATUS CLASS
  // ======================================================
  const getStatusClass = (status) => {
    return status
      ?.toLowerCase()
      .replace(/\s+/g, "-");
  };

  // ======================================================
  // LOADING
  // ======================================================
  if (loading) {
    return (
      <div className="admin-orders-page">
        <div className="admin-orders-container">
          <div className="admin-orders-loading">
            <div className="loading-spinner"></div>
            <p>Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // MAIN PAGE
  // ======================================================
  return (
    <div className="admin-orders-page">
      <div className="admin-orders-container">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}
        <div className="admin-orders-header">

          <div>
            <p className="admin-orders-subtitle">
              FoodAura ADMIN
            </p>

            <h1>Customer Orders</h1>

            <p className="admin-orders-description">
              View and manage all customer orders.
            </p>
          </div>

          <div className="orders-header-actions">

            <div className="total-orders">
              <ShoppingBag size={18} />
              <span>
                {orders.length}{" "}
                {orders.length === 1
                  ? "Order"
                  : "Orders"}
              </span>
            </div>

            <button
              type="button"
              className="refresh-orders-button"
              onClick={fetchOrders}
            >
              <RefreshCw size={17} />
              Refresh
            </button>

          </div>

        </div>

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}
        {error && (
          <div className="admin-orders-error">
            {error}
          </div>
        )}

        {/* ==================================================
            NO ORDERS
        ================================================== */}
        {orders.length === 0 ? (
          <div className="admin-no-orders">

            <div className="admin-no-orders-icon">
              <ShoppingBag size={48} />
            </div>

            <h2>No orders yet</h2>

            <p>
              There are currently no customer orders.
            </p>

          </div>
        ) : (

          /* ==================================================
             ORDERS LIST
          ================================================== */
          <div className="admin-orders-list">

            {orders.map((order) => (
              <div
                className="admin-order-card"
                key={order._id}
              >

                {/* ==================================================
                    ORDER HEADER
                ================================================== */}
                <div className="admin-order-header">

                  <div className="admin-order-title">

                    <div className="admin-order-icon">
                      <ShoppingBag size={20} />
                    </div>

                    <div>
                      <h2>
                        Order #{order._id.slice(-6)}
                      </h2>

                      <p className="admin-order-date">
                        <Clock size={14} />

                        {new Date(
                          order.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                  </div>

                  <span
                    className={`admin-order-status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </div>

                {/* ==================================================
                    CUSTOMER INFORMATION
                ================================================== */}
                <div className="admin-customer-section">

                  <div className="admin-section-title">
                    <User size={18} />
                    <h3>Customer</h3>
                  </div>

                  <div className="admin-customer-info">

                    <strong>
                      {order.customer?.name ||
                        order.user?.name ||
                        "Customer"}
                    </strong>

                    <span>
                      {order.customer?.phone ||
                        "No phone number"}
                    </span>

                    <span>
                      {order.user?.email ||
                        "No email"}
                    </span>

                  </div>

                </div>

                {/* ==================================================
                    ORDER ITEMS
                ================================================== */}
                <div className="admin-items-section">

                  <div className="admin-section-title">
                    <ShoppingBag size={18} />
                    <h3>Order Items</h3>
                  </div>

                  <div className="admin-order-items">

                    {order.items?.map(
                      (item, index) => (
                        <div
                          className="admin-order-item"
                          key={
                            item._id || index
                          }
                        >

                          <div className="admin-item-image-container">

                            {item.menuItem?.image ? (
                              <img
                                src={
                                  item.menuItem.image
                                }
                                alt={
                                  item.menuItem.name
                                }
                                className="admin-item-image"
                                onError={(e) => {
                                  e.currentTarget.style.display =
                                    "none";

                                  e.currentTarget.parentElement.classList.add(
                                    "image-error"
                                  );
                                }}
                              />
                            ) : (
                              <div className="admin-item-placeholder">
                                🍽️
                              </div>
                            )}

                            <div className="admin-item-fallback">
                              🍽️
                            </div>

                          </div>

                          <div className="admin-item-details">

                            <h4>
                              {item.menuItem?.name ||
                                "Menu Item"}
                            </h4>

                            <p>
                              ₹{item.price} ×{" "}
                              {item.quantity}
                            </p>

                          </div>

                          <strong className="admin-item-total">
                            ₹
                            {Number(item.price) *
                              Number(item.quantity)}
                          </strong>

                        </div>
                      )
                    )}

                  </div>

                </div>

                {/* ==================================================
                    DELIVERY DETAILS
                ================================================== */}
                <div className="admin-delivery-section">

                  <div className="admin-section-title">
                    <MapPin size={18} />
                    <h3>Delivery Details</h3>
                  </div>

                  <div className="admin-delivery-info">

                    <p>
                      <strong>Address:</strong>{" "}
                      {order.customer?.address ||
                        "Not provided"}
                    </p>

                    <p>
                      <strong>City:</strong>{" "}
                      {order.customer?.city ||
                        "Not provided"}
                    </p>

                    <p>
                      <strong>Pincode:</strong>{" "}
                      {order.customer?.pincode ||
                        "Not provided"}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {order.customer?.phone ||
                        "Not provided"}
                    </p>

                  </div>

                </div>

                {/* ==================================================
                    ORDER FOOTER
                ================================================== */}
                <div className="admin-order-footer">

                  <div className="admin-payment-info">

                    <CreditCard size={18} />

                    <span>
                      Payment:{" "}
                      <strong>
                        {order.paymentMethod}
                      </strong>
                    </span>

                  </div>

                  <div className="admin-total-amount">

                    <span>Total</span>

                    <strong>
                      ₹{order.totalAmount}
                    </strong>

                  </div>

                </div>

                {/* ==================================================
                    UPDATE STATUS
                ================================================== */}
                <div className="admin-status-section">

                  <label htmlFor={`status-${order._id}`}>
                    Update Order Status
                  </label>

                  <select
                    id={`status-${order._id}`}
                    value={order.status}
                    disabled={
                      updatingOrder === order._id
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        order._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Confirmed">
                      Confirmed
                    </option>

                    <option value="Preparing">
                      Preparing
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>

                  {updatingOrder === order._id && (
                    <span className="status-updating">
                      Updating...
                    </span>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminOrders;