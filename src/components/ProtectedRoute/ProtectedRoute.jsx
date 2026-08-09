import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../helpers/profile";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const logIn = localStorage.getItem("isLoggedIn");
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (logIn !== "true" || currentUser === null) {
      navigate("/");
    }
  }, [logIn, navigate]);

  if (logIn !== "true" || currentUser === null) {
    return null;
  }

  return children;
}

export default ProtectedRoute;
