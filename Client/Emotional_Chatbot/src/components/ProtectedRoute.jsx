import axios from "axios";
import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";
const ProtectedRoute = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        await axios.get(import.meta.env.VITE_VERIFYTOKEN_URL, {
          headers: {
            Authorization: token,
          },
        });
      } catch (error) {
        console.log("Token verification failed: ", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    verifyToken();
  }, [token, navigate]);

  return token ? <Outlet></Outlet> : null;
};
export default ProtectedRoute;
