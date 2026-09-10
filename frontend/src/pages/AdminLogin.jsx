import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // ======================================================
  // HANDLE INPUT CHANGE
  // ======================================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================================
  // HANDLE ADMIN LOGIN
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("/auth/login", formData);

      const user = response.data.user;

      // ==================================================
      // CHECK ADMIN ROLE
      // ==================================================
      if (user.role !== "admin") {
        // Do not save a normal user's login here
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setError(
          "Access denied. Admin account required."
        );

        return;
      }

      // ==================================================
      // SAVE ADMIN LOGIN
      // ==================================================
      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // ==================================================
      // GO TO ADMIN DASHBOARD
      // ==================================================
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);

      setError(
        error.response?.data?.message ||
          "Invalid email or password."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <p className="section-subtitle">
          FOODORA ADMIN
        </p>

        <h1>Admin Login</h1>

        <p className="auth-subtitle">
          Login to manage Foodora.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="auth-button"
          >
            Admin Login
          </button>

        </form>

      </div>
    </div>
  );
}

export default AdminLogin;