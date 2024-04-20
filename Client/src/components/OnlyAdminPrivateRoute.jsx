import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  // Check if isAuthenticated exists and if isAuthenticated.isAdmin is true

  return currentUser.isAdmin ? <Outlet /> : <Navigate to="/signin" />;
}
