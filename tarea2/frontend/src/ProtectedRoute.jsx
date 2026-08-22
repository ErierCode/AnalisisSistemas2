import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Layout from "./components/Layout";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
