import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const BASE_URL = "https://case-management-dkgs.onrender.com";

export default function Login() {

  const handleSuccess = async (res) => {
    try {
      // Decode Google JWT credential
      const user = JSON.parse(atob(res.credential.split(".")[1]));

      // Send to backend
      const response = await axios.post(
        `${BASE_URL}/api/auth/google`,
        {
          email: user.email,
          name: user.name
        }
      );

      // Store token
      localStorage.setItem("token", response.data.token);

      // Redirect
      window.location.href = "/dashboard";

    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex"
    }}>

      {/* LEFT SIDE */}
      <div style={{
        flex: 1,
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <img src="/logo.png" alt="logo" style={{ width: "250px" }} />
      </div>

      {/* RIGHT SIDE */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>

        {/* TOP LOGO */}
        <img src="/logo.png" alt="logo" style={{ width: "100px", marginBottom: "10px" }} />

        <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
          CASE MANAGEMENT
        </h1>

        <p style={{ color: "gray", marginBottom: "20px" }}>
          SYSTEM
        </p>

        <h2>Welcome Back</h2>

        <p style={{ marginBottom: "20px" }}>
          Sign in to manage your cases
        </p>

        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Login Failed")}
        />

      </div>
    </div>
  );
}