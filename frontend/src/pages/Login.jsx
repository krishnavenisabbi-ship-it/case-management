import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

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
            Sign in to manage your cases
          </p>

          {/* Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Continue
          </button>

        </div>
      </div>
    </div>
  );
}