// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// function PublicRoute({ children }) {
//   const navigate = useNavigate();
//   const logIn = localStorage.getItem("isLoggedIn");

//   useEffect(() => {
//     if (logIn !== null) {
//       navigate("/dashboard");
//     }
//   }, [logIn, navigate]);

//   if (logIn !== null) {
//     return null;
//   }
//   return children;
// }

// export default PublicRoute;

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../../api/axios";

function PublicRoute({ children }) {
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

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default PublicRoute;
