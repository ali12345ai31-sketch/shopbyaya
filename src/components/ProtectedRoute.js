import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  let role = localStorage.getItem("role");

  if (!role) {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        role = parsedUser.role;
      } catch (err) {
        role = null;
      }
    }
  }

  if (role !== "admin") {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          message: "Admin login required to open dashboard.",
          from: location.pathname
        }}
      />
    );
  }

  return children;
}
