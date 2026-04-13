import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // TEMP: disable auth check to prevent crash
  }, []);

  // Temporary login (no external auth)
  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex" data-testid="login-page">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-100">
        <img
          src="https://customer-assets.emergentagent.com/job_case-dashboard-pro-1/artifacts/hybcv49j_image.png"
          alt="Law"
          className="w-[420px] h-auto object-contain opacity-90"
        />
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md">

          {/* Title */}
          <h1 className="text-2xl font-bold mb-6 text-center">
            Case Management System
          </h1>

          {/* Welcome */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="text-gray-500 text-sm">
              Login to continue
            </p>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Login (Demo)
          </button>

          {/* Info */}
          <p className="text-xs text-gray-400 text-center mt-6">
            Authentication will be added later
          </p>
        </div>
      </div>
    </div>
  );
}