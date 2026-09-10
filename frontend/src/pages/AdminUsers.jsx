import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  // ======================================================
  // FETCH USERS
  // ======================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await API.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Fetch users error:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/admin/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOAD USERS WHEN PAGE OPENS
  // ======================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // ======================================================
  // DELETE USER
  // ======================================================

  const handleDelete = async (id, role) => {
    // Never allow admin deletion from this page
    if (role === "admin") {
      setError("Admin users cannot be deleted from this page.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setDeleteMessage("");

      const token = localStorage.getItem("token");

      await API.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove deleted user from UI
      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user._id !== id
        )
      );

      setDeleteMessage("User deleted successfully.");

      // Remove success message after 3 seconds
      setTimeout(() => {
        setDeleteMessage("");
      }, 3000);
    } catch (error) {
      console.error("Delete user error:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/admin/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="admin-users-page">
        <h2>Loading users...</h2>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="admin-users-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="admin-users-header">

        <div>
          <p className="section-subtitle">
            FOODORA ADMIN
          </p>

          <h1>User Management</h1>

          <p>
            View and manage registered users.
          </p>
        </div>

        <button
          className="back-dashboard-button"
          onClick={() =>
            navigate("/admin/dashboard")
          }
        >
          ← Dashboard
        </button>

      </div>

      {/* ==================================================
          USER COUNT
      ================================================== */}

      <div className="users-count">
        <strong>{users.length}</strong>{" "}
        registered user{users.length !== 1 ? "s" : ""}
      </div>

      {/* ==================================================
          ERROR MESSAGE
      ================================================== */}

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      {/* ==================================================
          DELETE SUCCESS MESSAGE
      ================================================== */}

      {deleteMessage && (
        <p className="success-message">
          {deleteMessage}
        </p>
      )}

      {/* ==================================================
          NO USERS
      ================================================== */}

      {users.length === 0 ? (

        <div className="empty-users">
          <p>No users found.</p>
        </div>

      ) : (

        /* ==================================================
           USERS TABLE
        ================================================== */

        <div className="users-table-container">

          <table className="users-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registration Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {users.map((user) => (

                <tr key={user._id}>

                  {/* NAME */}

                  <td>
                    {user.name}
                  </td>

                  {/* EMAIL */}

                  <td>
                    {user.email}
                  </td>

                  {/* ROLE */}

                  <td>

                    <span
                      className={
                        user.role === "admin"
                          ? "role-admin"
                          : "role-user"
                      }
                    >
                      {user.role}
                    </span>

                  </td>

                  {/* REGISTRATION DATE */}

                  <td>
                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* ACTION */}

                  <td>

                    {user.role === "admin" ? (

                      <span className="protected-user">
                        Protected
                      </span>

                    ) : (

                      <button
                        className="delete-user-button"
                        onClick={() =>
                          handleDelete(
                            user._id,
                            user.role
                          )
                        }
                      >
                        Delete
                      </button>

                    )}

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

export default AdminUsers;