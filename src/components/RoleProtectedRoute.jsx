import { Navigate } from "react-router-dom";
import { getToken, getUser } from "../utils/auth";

function RoleProtectedRoute({ children, allowedRoles }) {

    const token = getToken();
    const user = getUser();

    // Not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but doesn't have permission
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default RoleProtectedRoute;