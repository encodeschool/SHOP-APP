import { Navigate } from "react-router-dom";

const getRoles = () => JSON.parse(localStorage.getItem("roles")) || [];

const isAuthenticated = () => !!localStorage.getItem("token");

function RoleRoute({ children, roles = [] }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = getRoles();

  // If no specific roles required → allow any authenticated user
  if (roles.length === 0) {
    return children;
  }

  // Check if user has at least one required role
  const hasRole = userRoles.some(role => roles.includes(role));
  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleRoute;