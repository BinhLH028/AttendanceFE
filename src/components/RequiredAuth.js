import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();
    // console.log(allowedRoles.find(r => auth?.userData?.role == r))

    return (
        (allowedRoles.find(r => auth?.userData?.role == r))
        // (auth?.userData?.role == allowedRoles)
            ? <Outlet />
            : auth?.email
                // ? <Outlet />
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
            // auth?.email
            // ? <Outlet />
            // : <Navigate to="/login" state={{ from: location }} replace />
        );
}

export default RequireAuth;