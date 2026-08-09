import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PublicRoute({ children }) {
  const navigate = useNavigate();
  const logIn = localStorage.getItem("isLoggedIn");

  useEffect(() => {
    if (logIn !== null) {
      navigate("/dashboard");
    }
  }, [logIn, navigate]);

  if (logIn !== null) {
    return null;
  }
  return children;
}

export default PublicRoute;
