import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const logIn = localStorage.getItem("isLoggedIn");

  useEffect(() => {
    if (logIn !== "true") {
      navigate("/");
    }
  }, [logIn, navigate]);

  if (logIn !== "true") {
    return null;
  }

  return children;
}

export default ProtectedRoute;
