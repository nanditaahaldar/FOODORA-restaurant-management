import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminMenu() {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await API.get("/menu");

      setMenuItems(response.data.menuItems);
    } catch (error) {
      console.error(error);
      setError("Failed to load menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      fetchMenuItems();
      return;
    }

    try {
      const response = await API.get(
        `/menu/search?name=${encodeURIComponent(value)}`
      );

      setMenuItems(response.data.menuItems);
    } catch (error) {
      console.error(error);
      setError("Failed to search menu items.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/menu/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMenuItems(menuItems.filter((item) => item._id !== id));

      alert("Menu item deleted successfully.");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Failed to delete menu item."
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-menu-page">
        <h2>Loading menu items...</h2>
      </div>
    );
  }

  return (
    <div className="admin-menu-page">

      <div className="admin-menu-header">
        <div>
          <p className="section-subtitle">FOODORA ADMIN</p>
          <h1>Menu Management</h1>
          <p>Manage all your restaurant menu items.</p>
        </div>

        <button
          className="add-menu-button"
          onClick={() => navigate("/admin/menu/add")}
        >
          + Add Menu Item
        </button>
      </div>

      <div className="menu-search-box">
        <input
          type="text"
          placeholder="Search menu item by name..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      {menuItems.length === 0 ? (
        <div className="empty-admin-menu">
          <p>No menu items found.</p>
        </div>
      ) : (
        <div className="admin-menu-table-container">

          <table className="admin-menu-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {menuItems.map((item) => (
                <tr key={item._id}>

                  <td>{item.name}</td>

                  <td>{item.category}</td>

                  <td>₹{item.price}</td>

                  <td>
                    <span
                      className={
                        item.availability === "In Stock"
                          ? "stock-in"
                          : "stock-out"
                      }
                    >
                      {item.availability}
                    </span>
                  </td>

                  <td className="admin-menu-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        navigate(`/admin/menu/edit/${item._id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}
    </div>
  );
}

export default AdminMenu;