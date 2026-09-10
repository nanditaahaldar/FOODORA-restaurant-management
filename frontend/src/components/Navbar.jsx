import { useState } from "react";

import {
  Home,
  Utensils,
  ShoppingCart,
  ClipboardList,
  Heart,
  User,
  LogOut,
  X,
  Menu as MenuIcon,
  LayoutDashboard,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { getUserRole, isLoggedIn } from "../services/auth";
import FoodAuraLogo from "../assets/Foodaura-logo.png";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const loggedIn = isLoggedIn();
  const role = getUserRole();

  // ======================================================
  // CLOSE MOBILE MENU
  // ======================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ======================================================
  // TOGGLE MOBILE MENU
  // ======================================================

  const toggleMenu = () => {
    setMenuOpen((previous) => !previous);
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);

    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* ==================================================
          LOGO
      ================================================== */}

      <div className="logo">
        <Link to="/" onClick={closeMenu}>
          <img
            src={FoodAuraLogo}
            alt="FoodAura"
            className="FoodAura-logo"
          />
        </Link>
      </div>

      {/* ==================================================
          MOBILE MENU BUTTON
      ================================================== */}

      <button
        className="mobile-menu-button"
        type="button"
        onClick={toggleMenu}
        aria-label={
          menuOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        }
        aria-expanded={menuOpen}
      >
        {menuOpen ? (
          <X size={26} />
        ) : (
          <MenuIcon size={26} />
        )}
      </button>

      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <div
        className={`nav-links ${
          menuOpen ? "nav-open" : ""
        }`}
      >

        {/* ==================================================
            HOME
        ================================================== */}

        <Link to="/" onClick={closeMenu}>
          <Home size={18} />
          <span>Home</span>
        </Link>

        {/* ==================================================
            CUSTOMER LINKS
        ================================================== */}

        {loggedIn && role === "user" && (
          <>
            <Link to="/menu" onClick={closeMenu}>
              <Utensils size={18} />
              <span>Menu</span>
            </Link>

            <Link to="/cart" onClick={closeMenu}>
              <ShoppingCart size={18} />
              <span>Cart</span>
            </Link>

            <Link to="/my-orders" onClick={closeMenu}>
              <ClipboardList size={18} />
              <span>My Orders</span>
            </Link>

            <Link to="/favorites" onClick={closeMenu}>
              <Heart size={18} />
              <span>Favorites</span>
            </Link>

            <Link to="/profile" onClick={closeMenu}>
              <User size={18} />
              <span>Profile</span>
            </Link>
          </>
        )}

        {/* ==================================================
            ADMIN LINKS
        ================================================== */}

        {loggedIn && role === "admin" && (
          <>
            <Link
              to="/admin/dashboard"
              onClick={closeMenu}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/admin/menu"
              onClick={closeMenu}
            >
              <Utensils size={18} />
              <span>Menu Management</span>
            </Link>

            <Link
              to="/admin/orders"
              onClick={closeMenu}
            >
              <ClipboardList size={18} />
              <span>Orders</span>
            </Link>

            <Link
              to="/admin/users"
              onClick={closeMenu}
            >
              <User size={18} />
              <span>Users</span>
            </Link>
          </>
        )}

        {/* ==================================================
            LOGIN / REGISTER
        ================================================== */}

        {!loggedIn && (
          <>
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>

            <Link to="/register" onClick={closeMenu}>
              Register
            </Link>
          </>
        )}

        {/* ==================================================
            LOGOUT
        ================================================== */}

        {loggedIn && (
          <button
            type="button"
            onClick={handleLogout}
            className="logout-button"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        )}

      </div>
    </nav>
  );
}

export default Navbar;