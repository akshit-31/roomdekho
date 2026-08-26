import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loader from "./Loader";

/**
 * Guards nested routes by role, e.g. <RoleRoute allow={["owner","admin"]} />.
 * Requires the user to already be authenticated; combine with ProtectedRoute
 * at the layout level, or rely on the backend to reject unauthorized calls.
 */
export default function RoleRoute({ allow = [] }) {
  const { user, isAuthenticated, status } = useAuth();

  if (status === "loading") return <Loader label="Checking your access..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allow.includes(user?.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}
