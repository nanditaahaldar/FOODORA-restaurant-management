// ======================================================
// GET CURRENT LOGGED-IN USER
// ======================================================

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");

    if (user) {
      return JSON.parse(user);
    }
  } catch (error) {
    console.error("Error reading user:", error);
  }

  return null;
};

// ======================================================
// GET USER ID
// ======================================================

export const getUserId = () => {
  const user = getCurrentUser();

  if (user) {
    return (
      user._id ||
      user.id ||
      user.userId
    );
  }

  // Fallback: read ID from JWT
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    return (
      payload.id ||
      payload.userId ||
      payload._id
    );
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

// ======================================================
// GET USER ROLE
// ======================================================

export const getUserRole = () => {
  const user = getCurrentUser();

  if (user?.role) {
    return user.role;
  }

  // Fallback: read role from JWT
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    return payload.role || null;
  } catch (error) {
    return null;
  }
};

// ======================================================
// CHECK LOGIN
// ======================================================

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};