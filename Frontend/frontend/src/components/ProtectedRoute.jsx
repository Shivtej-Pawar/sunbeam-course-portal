import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // Role-based protection (admin)
  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;
