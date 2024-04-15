import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const isAuthenticated = useSelector((state) => state.user);
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
}
