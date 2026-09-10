import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalMenuItems: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/admin/login");
          return;
        }

        const response = await API.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDashboard(response.data.dashboard);
      } catch (error) {
        console.error("Dashboard error:", error);

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/admin/login");
          return;
        }

        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="admin-dashboard">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error) {
    return (
      <div className="admin-dashboard">
        <h2 className="error">{error}</h2>
      </div>
    );
  }

  // ======================================================
  // DASHBOARD
  // ======================================================

  return (
    <div className="admin-dashboard">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="admin-dashboard-header">
        <p className="section-subtitle">
          FOODORA ADMIN
        </p>

        <h1>Admin Dashboard</h1>

        <p>
          Manage your restaurant from one place.
        </p>
      </div>

      {/* ==================================================
          DASHBOARD CARDS
      ================================================== */}

      <div className="dashboard-cards">

        {/* TOTAL MENU ITEMS */}

        <div className="dashboard-card">
          <div className="dashboard-icon">
            🍽️
          </div>

          <div>
            <h3>Total Menu Items</h3>

            <p>
              {dashboard.totalMenuItems}
            </p>
          </div>
        </div>

        {/* TOTAL USERS */}

        <div className="dashboard-card">
          <div className="dashboard-icon">
            👥
          </div>

          <div>
            <h3>Total Users</h3>

            <p>
              {dashboard.totalUsers}
            </p>
          </div>
        </div>

        {/* TOTAL ORDERS */}

        <div className="dashboard-card">
          <div className="dashboard-icon">
            🛒
          </div>

          <div>
            <h3>Total Orders</h3>

            <p>
              {dashboard.totalOrders}
            </p>
          </div>
        </div>

        {/* TOTAL REVENUE */}

        <div className="dashboard-card">
          <div className="dashboard-icon">
            💰
          </div>

          <div>
            <h3>Total Revenue</h3>

            <p>
              ₹{dashboard.totalRevenue || 0}
            </p>
          </div>
        </div>

      </div>

      {/* ==================================================
          ADMIN ACTIONS
      ================================================== */}

      <div className="admin-dashboard-actions">

        <button
          onClick={() => navigate("/admin/menu")}
        >
          Manage Menu
        </button>

        <button
          onClick={() => navigate("/admin/users")}
        >
          Manage Users
        </button>

        <button
          onClick={() => navigate("/admin/orders")}
        >
          Manage Orders
        </button>

      </div>

    </div>
  );
}

export default AdminDashboard;