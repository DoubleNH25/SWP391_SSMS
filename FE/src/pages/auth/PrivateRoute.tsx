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
    payload?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  if (!role) {
    return <Navigate to="/khong-co-quyen" />;
  }
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/khong-co-quyen" />;
  }
  return children;
}

function RoleBasedRedirect() {
  let decoded;
  try {
    decoded = DecodeJWT();
  } catch {
    console.error("DecodeJWT failed");
    return <Navigate to="/khong-co-quyen" />;
  }
  const role =
    decoded?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  switch (role) {
    case "Admin":
      return <Navigate to="/nguoi-dung" />;
    case "Manager":
      return <Navigate to="/hoc-sinh" />;
    case "Nurse":
      return <Navigate to="/lich" />;
    case "Parent":
      return <Navigate to="/phu-huynh/ho-so-suc-khoe" />;
    default:
      return <Navigate to="/khong-co-quyen" />;
  }
}

export { PrivateRoute, RoleBasedRedirect };
