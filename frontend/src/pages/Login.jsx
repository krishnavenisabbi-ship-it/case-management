import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const BASE_URL = "https://case-management-dkgs.onrender.com";

export default function Login() {

  const handleSuccess = async (res) => {
    try {
      const user = JSON.parse(atob(res.credential.split(".")[1]));

      const response = await axios.post(
        `${BASE_URL}/api/auth/google`,
        {
          email: user.email,
          name: user.name
        }
      );

      localStorage.setItem("token", response.data.token);

      window.location.href = "/dashboard";

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
}