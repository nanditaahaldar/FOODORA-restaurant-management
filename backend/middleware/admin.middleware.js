// ======================================================
// ADMIN MIDDLEWARE
// ======================================================

const adminMiddleware = (req, res, next) => {
  try {
    // Check whether authentication middleware
    // has already added the user to the request
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized. Please login first.",
      });
    }

    // Check user's role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: Admins only",
      });
    }

    // User is an admin
    next();

  } catch (error) {
    console.error("Admin middleware error:", error);

    return res.status(403).json({
      message: "Access denied. Admin privileges required.",
    });
  }
};

module.exports = adminMiddleware;