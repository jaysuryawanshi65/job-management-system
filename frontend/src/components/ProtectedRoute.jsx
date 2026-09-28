import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // Backend Role enum:
  // ADMIN = 0
  // RECRUITER = 1
  // JOB_SEEKER = 2
  const roleMap = {
    0: "ADMIN",
    1: "RECRUITER",
    2: "JOB_SEEKER",
  };

  const userRole =
    typeof user.role === "number" ? roleMap[user.role] : user.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }

    if (userRole === "RECRUITER") {
      return <Navigate to="/recruiter" replace />;
    }

    if (userRole === "JOB_SEEKER") {
      return <Navigate to="/jobseeker" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
