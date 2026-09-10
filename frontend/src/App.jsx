import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// ======================================================
// PUBLIC PAGES
// ======================================================
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import MenuDetails from "./pages/MenuDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";

// ======================================================
// ADMIN PAGES
// ======================================================
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMenu from "./pages/AdminMenu";
import AddMenuItem from "./pages/AddMenuItem";
import EditMenuItem from "./pages/EditMenuItem";
import AdminUsers from "./pages/AdminUsers";

// ======================================================
// USER / CUSTOMER PAGES
// ======================================================
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import AdminOrders from "./pages/AdminOrders";
import Favorites from "./pages/Favorites";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* ==================================================
            PUBLIC PAGES
        ================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/menu"
          element={<Menu />}
        />

        <Route
          path="/menu/:id"
          element={<MenuDetails />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ==================================================
            ADMIN LOGIN
        ================================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ==================================================
            CUSTOMER PAGES
            ONLY LOGGED-IN USERS CAN ACCESS
        ================================================== */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            ADMIN PAGES
            ONLY ADMIN CAN ACCESS
        ================================================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminMenu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu/add"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AddMenuItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditMenuItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
  path="/admin/orders"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminOrders />
    </ProtectedRoute>
  }
/> 

<Route
  path="/favorites"
  element={
    <ProtectedRoute allowedRoles={["user"]}>
      <Favorites />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;