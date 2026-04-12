import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user data passed from AuthCallback, skip auth check
    if (location.state?.user) {
      setUser(location.state.user);
      setIsAuth(true);
      return;
    }

    // CRITICAL: If returning from OAuth callback, skip the /me check
    if (window.location.hash?.includes("session_id=")) {
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    fetch(`${backendUrl}/api/auth/me`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((u) => {
        setUser(u);
        setIsAuth(true);
      })
      .catch(() => {
        setIsAuth(false);
        navigate("/login", { replace: true });
      });
  }, [navigate, location.state]);

  if (isAuth === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuth) return null;

  return typeof children === "function" ? children(user) : children;
}
