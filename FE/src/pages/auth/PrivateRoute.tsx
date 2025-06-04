import { DecodeJWT } from "@/utils/DecodeJWT";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles }) {
    const payload = DecodeJWT();
    if (!payload) {
        return <Navigate to="/login" />;
    }
    const role = payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (!role) {
        return <Navigate to="/unauthorized" />;
    }
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/unauthorized" />;
    }
    return children;
}

function RoleBasedRedirect() {
    let decoded;
    try {
        decoded = DecodeJWT();
    } catch (error) {
        return <Navigate to="/unauthorized" />;
    }
    const role = decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    switch (role) {
        case "Admin":
            return <Navigate to="/user" />;
        case "Manager":
            return <Navigate to="/student" />;
        case "Nurse":
            return <Navigate to="/calendar" />;
        case "Parent":
            return <Navigate to="/parent/health-profiles" />;
        default:
            return <Navigate to="/unauthorized" />;
    }
}

export { PrivateRoute, RoleBasedRedirect };