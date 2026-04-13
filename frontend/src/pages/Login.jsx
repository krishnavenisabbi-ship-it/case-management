import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">

      {/* Left side image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-100">
        <img
          src="https://customer-assets.emergentagent.com/job_case-dashboard-pro-1/artifacts/hybcv49j_image.png"
          alt="Law"
          className="w-[420px] h-auto object-contain"
        />
      </div>

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">

          {/* Title */}
          <h1 className="text-2xl font-bold mb-2">
            CASE MANAGEMENT
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            SYSTEM
          </p>

          {/* Welcome */}
          <h2 className="text-3xl font-bold mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 mb-8">
            Sign in with Google
          </p>

          {/* ✅ Google Login Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log("LOGIN SUCCESS", credentialResponse);

                // TEMP: redirect after login
                navigate("/dashboard");
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}