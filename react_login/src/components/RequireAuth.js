import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/authContext";

const RequireAuth = ({allowedRoles}) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  // in Navigate, we need to have a "state" and "replace" 
  // because it replaces the current route with the new route

  // For example, we want to go to /admin page but we are not logged in, we will reroute to /login
  // If we press the back-button, we don't want to go back to /admin page, we want to go back to the previous page

  // Hence the replaces basically replaces the browser history with the new route /login
  return (
    auth?.roles?.find((role) => allowedRoles?.includes(role))
      ? <Outlet />
      : auth?.user 
        ? <Navigate to="/unauthorized" state={{ from: location }} replace/>
        : <Navigate to="/login" state={{ from: location }} replace/>
  )
}

export default RequireAuth