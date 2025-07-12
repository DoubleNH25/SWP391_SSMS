import { DecodeJWT } from "@/utils/DecodeJWT";
import { Navigate } from "react-router-dom";

function PrivateRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const payload = DecodeJWT();
  if (!payload) {
    return <Navigate to="/dang-nhap" />;
  }
  const role =
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  if (!role) {
    return <Navigate to="/khong-co-quyen" />;
  }
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/khong-co-quyen" />;
  }
  return children;
}

export { PrivateRoute };
