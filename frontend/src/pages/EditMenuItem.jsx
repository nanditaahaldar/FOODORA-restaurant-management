import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function EditMenuItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Starter",
    price: "",
    availability: "In Stock",
    image: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await API.get(`/menu/${id}`);

        const item = response.data.menuItem;

        setFormData({
          name: item.name,
          description: item.description,
          category: item.category,
          price: item.price,
          availability: item.availability,
          image: item.image || ""
        });

      } catch (error) {
        console.error(error);
        setError("Failed to load menu item.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

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

      await API.put(`/menu/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess("Menu item updated successfully!");

      setTimeout(() => {
        navigate("/admin/menu");
      }, 1000);

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to update menu item."
      );
    }
  };

  if (loading) {
    return (
      <div className="admin-form-page">
        <h2>Loading menu item...</h2>
      </div>
    );
  }

  return (
    <div className="admin-form-page">

      <div className="admin-form-card">

        <p className="section-subtitle">
          FoodAura ADMIN
        </p>

        <h1>Edit Menu Item</h1>

        <p className="admin-form-subtitle">
          Update the details of this menu item.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Item Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
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
              <option value="Out of Stock">
                Out of Stock
              </option>
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
            Update Menu Item
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

export default EditMenuItem;