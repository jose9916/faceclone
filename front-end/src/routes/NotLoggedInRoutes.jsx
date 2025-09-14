import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export function NotLoggedInRoutes() {
  const { user } = useSelector((user) => ({ ...user }));
  return user ? <Navigate to="/" /> : <Outlet />;
}
