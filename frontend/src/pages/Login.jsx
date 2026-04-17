import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {

  const navigate = useNavigate(); // ✅ ADD THIS

  const handleSuccess = (res) => {
    console.log("LOGIN SUCCESS", res);
    localStorage.setItem("user", JSON.stringify(res));

    navigate("/dashboard"); // ✅ FIXED
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>

      {/* LEFT SIDE */}
      <div style={{
        flex: 1,
        background: "#f3f4f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <img src={logo} alt="logo" style={{ width: "250px" }} />
      </div>

      {/* RIGHT SIDE */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>

        <img src={logo} alt="logo" style={{ width: "100px", marginBottom: "10px" }} />

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