import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import logo from "../assets/logo.png";

const BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "https://case-management-fei4.onrender.com";
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "400532799045-aqoo74q76bms4o0erh379oou3np727b5.apps.googleusercontent.com";

export default function Login() {
  const handleSuccess = async (res) => {
    try {
      const user = JSON.parse(atob(res.credential.split(".")[1]));

      const response = await axios.post(`${BASE_URL}/api/auth/google`, {
        email: user.email,
        name: user.name,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexWrap: "wrap",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          flex: "1 1 320px",
          minHeight: "40vh",
          background: "linear-gradient(135deg, #e0f2fe, #f8fafc)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
        }}
      >
        <img src={logo} alt="logo" style={{ width: "min(280px, 70vw)" }} />
      </div>

      <div
        style={{
          flex: "1 1 320px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
        }}
      >
        <img src={logo} alt="logo" style={{ width: "100px", marginBottom: "12px" }} />

        <h1 style={{ fontSize: "28px", fontWeight: "bold", textAlign: "center" }}>
          CASE MANAGEMENT
        </h1>

        <p style={{ color: "#64748b", marginBottom: "24px" }}>SYSTEM</p>

        <h2 style={{ marginBottom: "8px" }}>Welcome Back</h2>

        <p style={{ marginBottom: "24px", color: "#475569", textAlign: "center" }}>
          Sign in to manage cases, uploads, and adjournment updates.
        </p>

        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Login Failed")}
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}
