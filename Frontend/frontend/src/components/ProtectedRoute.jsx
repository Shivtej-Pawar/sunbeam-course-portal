import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  // Not logged in
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection
  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;
