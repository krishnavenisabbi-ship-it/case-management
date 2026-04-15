import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Login Page</h1>

      <GoogleLogin
        onSuccess={(res) => {
          console.log("SUCCESS", res);
          window.location.href = "/dashboard";
        }}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
}