// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getCurrentUser } from "../../helpers/profile";

// function ProtectedRoute({ children }) {
//   const navigate = useNavigate();

//   const logIn = localStorage.getItem("isLoggedIn");
//   const currentUser = getCurrentUser();

//   useEffect(() => {
//     if (logIn !== "true" || currentUser === null) {
//       navigate("/");
//     }
//   }, [logIn, navigate, currentUser]);

//   if (logIn !== "true" || currentUser === null) {
//     return null;
//   }

//   return children;
// }

// export default ProtectedRoute;

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../api/axios";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        await api.post("/auth/current-user");
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute;
