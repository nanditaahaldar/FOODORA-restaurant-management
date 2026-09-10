import { Navigate } from "react-router-dom";
import {
  isLoggedIn,
  getUserRole,
} from "../services/auth";

function ProtectedRoute({
  children,
  allowedRoles,
}) {
  // Not logged in
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const role = getUserRole();

  // If specific roles are required
  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;