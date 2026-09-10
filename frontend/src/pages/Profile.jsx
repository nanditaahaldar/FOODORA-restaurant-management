import { useEffect, useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Map,
  Camera,
  Trash2,
  Edit3,
  Save,
  X,
  LogOut,
} from "lucide-react";

import API from "../services/api";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    profileImage: "",
  });

  // ==========================================
  // GET PROFILE
  // ==========================================

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = response.data.user;

        setUser(profile);

        setFormData({
          name: profile.name || "",
          phone: profile.phone || "",
          address: profile.address || "",
          city: profile.city || "",
          pincode: profile.pincode || "",
          profileImage: profile.profileImage || "",
        });

        // Keep localStorage user data updated
        localStorage.setItem("user", JSON.stringify(profile));
      } catch (err) {
        console.error("Failed to load profile:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
        } else {
          setError("Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // PROFILE PHOTO SELECT
  // ==========================================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Allow only image files
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Maximum 2 MB for now
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2 MB.");
      return;
    }

    setError("");

    // Temporary local preview
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((previous) => ({
        ...previous,
        profileImage: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ==========================================
  // REMOVE PROFILE PHOTO
  // ==========================================

  const handleRemovePhoto = () => {
    setFormData((previous) => ({
      ...previous,
      profileImage: "",
    }));

    // Clear selected file from input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setError("");
    setMessage("");
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async () => {
    setMessage("");

    setError("");

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setSaving(true);

      const response = await API.put(
        "/users/profile",
        {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          profileImage: formData.profileImage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;

      setUser(updatedUser);

      setFormData({
        name: updatedUser.name || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
        city: updatedUser.city || "",
        pincode: updatedUser.pincode || "",
        profileImage: updatedUser.profileImage || "",
      });

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setEditing(false);

      setMessage("Profile updated successfully.");

      // Remove message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

        return;
      }

      setError(
        err.response?.data?.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {
    if (!user) return;

    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      city: user.city || "",
      pincode: user.pincode || "",
      profileImage: user.profileImage || "",
    });

    // Clear selected file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setEditing(false);

    setError("");

    setMessage("");
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-empty">
          <User size={60} />

          <h1>Please Login</h1>

          <p>
            You need to login to view your profile.
          </p>

          <Link
            to="/login"
            className="profile-login-btn"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // PROFILE PAGE
  // ==========================================

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* =====================================
            PROFILE HEADER
        ====================================== */}

        <div className="profile-header">

          <div className="profile-avatar-section">

            <div className="profile-avatar">

              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="profile-avatar-image"
                />
              ) : (
                <User size={45} />
              )}

            </div>

            {editing && (
              <>
                <div className="profile-photo-actions">

                  <button
                    type="button"
                    className="change-photo-btn"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    <Camera size={16} />
                    Change Photo
                  </button>

                  {formData.profileImage && (
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={handleRemovePhoto}
                    >
                      <Trash2 size={16} />
                      Remove Photo
                    </button>
                  )}

                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: "none" }}
                />
              </>
            )}

          </div>

          <div className="profile-title">
            <h1>My Profile</h1>

            <p>
              Manage your Foodora account information
            </p>
          </div>

        </div>

        {/* =====================================
            SUCCESS / ERROR MESSAGE
        ====================================== */}

        {message && (
          <div className="profile-success">
            {message}
          </div>
        )}

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        {/* =====================================
            PROFILE CARD
        ====================================== */}

        <div className="profile-card">

          <div className="profile-card-header">

            <div>
              <h2>Personal Information</h2>

              <p>
                Update your personal and delivery information.
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                className="edit-profile-btn"
                onClick={() => {
                  setEditing(true);
                  setMessage("");
                  setError("");
                }}
              >
                <Edit3 size={17} />
                Edit Profile
              </button>
            )}

          </div>

          {/* =====================================
              FORM
          ====================================== */}

          <div className="profile-form">

            {/* NAME */}

            <div className="profile-field">

              <label>
                <User size={17} />
                Name
              </label>

              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              ) : (
                <div className="profile-value">
                  {user.name || "Not available"}
                </div>
              )}

            </div>

            {/* EMAIL */}

            <div className="profile-field">

              <label>
                <Mail size={17} />
                Email
              </label>

              <div className="profile-value disabled-field">
                {user.email || "Not available"}
              </div>

              <small>
                Email cannot be changed.
              </small>

            </div>

            {/* PHONE */}

            <div className="profile-field">

              <label>
                <Phone size={17} />
                Phone Number
              </label>

              {editing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="profile-value">
                  {user.phone || "Not added yet"}
                </div>
              )}

            </div>

            {/* ADDRESS */}

            <div className="profile-field profile-field-full">

              <label>
                <MapPin size={17} />
                Address
              </label>

              {editing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  rows="3"
                />
              ) : (
                <div className="profile-value">
                  {user.address || "Not added yet"}
                </div>
              )}

            </div>

            {/* CITY */}

            <div className="profile-field">

              <label>
                <Building2 size={17} />
                City
              </label>

              {editing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                />
              ) : (
                <div className="profile-value">
                  {user.city || "Not added yet"}
                </div>
              )}

            </div>

            {/* PINCODE */}

            <div className="profile-field">

              <label>
                <Map size={17} />
                Pincode
              </label>

              {editing ? (
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter your pincode"
                  maxLength="6"
                />
              ) : (
                <div className="profile-value">
                  {user.pincode || "Not added yet"}
                </div>
              )}

            </div>

          </div>

          {/* =====================================
              EDIT ACTIONS
          ====================================== */}

          {editing && (
            <div className="profile-edit-actions">

              <button
                type="button"
                className="save-profile-btn"
                onClick={handleSave}
                disabled={saving}
              >
                <Save size={18} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                className="cancel-profile-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                <X size={18} />
                Cancel
              </button>

            </div>
          )}

          {/* =====================================
              BOTTOM ACTIONS
          ====================================== */}

          <div className="profile-actions">

            <Link
              to="/my-orders"
              className="profile-orders-btn"
            >
              View My Orders
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="profile-logout-btn"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;