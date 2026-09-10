import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { getUserId, isLoggedIn } from "../services/auth";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [loading, setLoading] = useState(false);

  // ======================================================
  // USER CART KEY
  // ======================================================

  const userId = getUserId();

  const cartKey = userId
    ? `cart_${userId}`
    : "cart";

  // ======================================================
  // LOAD CART
  // ======================================================

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const savedCart = JSON.parse(
      localStorage.getItem(cartKey) || "[]"
    );

    if (savedCart.length === 0) {
      navigate("/cart");
      return;
    }

    setCart(savedCart);
  }, [navigate, cartKey]);

  // ======================================================
  // INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ======================================================
  // TOTAL
  // ======================================================

  const totalAmount = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  // ======================================================
  // PLACE ORDER
  // ======================================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      navigate("/cart");
      return;
    }

    try {
      setLoading(true);

      // Backend only needs menuItem + quantity.
      // Backend calculates prices itself.

      const items = cart.map((item) => ({
        menuItem: item._id,
        quantity: Number(item.quantity),
      }));

      const orderData = {
        items,

        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          pincode: formData.pincode.trim(),
        },

        paymentMethod,
      };

      const response = await API.post(
        "/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Order created:",
        response.data
      );

      // Clear ONLY this user's cart
      localStorage.removeItem(cartKey);

      setCart([]);

   navigate("/my-orders");

    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to place order."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="checkout-page">

      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your order</p>
      </div>

      <div className="checkout-container">

        {/* CUSTOMER DETAILS */}

        <div className="checkout-form">

          <h2>Delivery Details</h2>

          <form onSubmit={handlePlaceOrder}>

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
                rows="4"
                required
              />
            </div>

            <div className="checkout-row">

              <div className="form-group">
                <label>City</label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>

                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  required
                />
              </div>

            </div>

            {/* PAYMENT */}

            <h2 className="payment-title">
              Payment Method
            </h2>

            <div className="payment-options">

              <label className="payment-option">

                <input
                  type="radio"
                  value="Cash on Delivery"
                  checked={
                    paymentMethod ===
                    "Cash on Delivery"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  Cash on Delivery
                </span>

              </label>

              <label className="payment-option">

                <input
                  type="radio"
                  value="Online Payment"
                  checked={
                    paymentMethod ===
                    "Online Payment"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <span>
                  Online Payment
                </span>

              </label>

            </div>

            <button
              type="submit"
              className="place-order-button"
              disabled={loading}
            >
              {loading
                ? "Placing Order..."
                : "Place Order"}
            </button>

          </form>

        </div>

        {/* ORDER SUMMARY */}

        <div className="order-summary">

          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div
              className="summary-item"
              key={item._id}
            >

              <div>
                <h3>{item.name}</h3>

                <p>
                  ₹{item.price} ×{" "}
                  {item.quantity}
                </p>
              </div>

              <strong>
                ₹
                {Number(item.price) *
                  Number(item.quantity)}
              </strong>

            </div>
          ))}

          <hr />

          <div className="summary-total">

            <span>Total</span>

            <strong>
              ₹{totalAmount}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;