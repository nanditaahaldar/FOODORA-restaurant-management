import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddMenuItem() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Starter",
    price: "",
    availability: "In Stock",
    image: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      await API.post("/menu", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess("Menu item added successfully!");

      setTimeout(() => {
        navigate("/admin/menu");
      }, 1000);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to add menu item."
      );
    }
  };

  return (
    <div className="admin-form-page">

      <div className="admin-form-card">

        <p className="section-subtitle">FOODORA ADMIN</p>

        <h1>Add Menu Item</h1>

        <p className="admin-form-subtitle">
          Add a new dish to the restaurant menu.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Item Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description"
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Starter">Starter</option>
              <option value="Main Course">Main Course</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price</label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Availability</label>

            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="form-group">
            <label>Image URL</label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
            />
          </div>

          {error && (
            <p className="form-error">{error}</p>
          )}

          {success && (
            <p className="form-success">{success}</p>
          )}

          <button
            type="submit"
            className="auth-button"
          >
            Add Menu Item
          </button>

        </form>

        <button
          className="back-admin-button"
          onClick={() => navigate("/admin/menu")}
        >
          ← Back to Menu Management
        </button>

      </div>

    </div>
  );
}

export default AddMenuItem;