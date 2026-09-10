import { useState } from "react";
import {
  Home,
  Utensils,
  ShoppingCart,
  ClipboardList,
  Heart,
  User,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getUserRole, isLoggedIn } from "../services/auth";
import foodoraLogo from "../assets/Foodora-logo.png";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const loggedIn = isLoggedIn();
  const role = getUserRole();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">

      {/* LOGO */}
      <div className="logo">
        <Link to="/" onClick={closeMenu}>
          <img
            src={foodoraLogo}
            alt="Foodora"
            className="foodora-logo"
          />
        </Link>
      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        className="mobile-menu-button"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* NAVIGATION */}
      <div className={`nav-links ${menuOpen ? "nav-open" : ""}`}>

        {/* COMMON LINKS */}
        <Link to="/" onClick={closeMenu}>
  <Home size={18} />
  <span>Home</span>
</Link>

<Link to="/menu" onClick={closeMenu}>
  <Utensils size={18} />
  <span>Menu</span>
</Link>

        {/* CUSTOMER LINKS */}
       {loggedIn && role === "user" && (
  <>
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

        {/* ADMIN LINKS */}
        {loggedIn && role === "admin" && (
          <>
            <Link to="/admin/dashboard" onClick={closeMenu}>
              Dashboard
            </Link>

            <Link to="/admin/menu" onClick={closeMenu}>
              Menu Management
            </Link>

            <Link to="/admin/orders" onClick={closeMenu}>
              Orders
            </Link>

            <Link to="/admin/users" onClick={closeMenu}>
              Users
            </Link>
          </>
        )}

        {/* LOGIN / REGISTER */}
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

        {/* LOGOUT */}
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