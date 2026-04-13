import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Disabled auth check to prevent crash
  }, []);

  // Temporary login (no external auth)
  const handleGoogleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex" data-testid="login-page">
      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-100">
                  alt="Scales of Justice"
          className="w-[420px] h-auto object-contain opacity-90"
        />
      </div>

      {/* Right - Login */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <img
              src="https://customer-assets.emergentagent.com/job_case-dashboard-pro-1/artifacts/kc4drf9a_image.png"
              alt="Logo"
              className="w-12 h-12"
            />
            <div>
              <h1 className="text-xl font-bold">CASE MANAGEMENT</h1>
              <p className="text-xs text-gray-500">SYSTEM</p>
            </div>
          </div>

          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-500 text-sm">
              Sign in to manage your cases
            </p>
          </div>

          {/* Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border-2 border-black px-6 py-4 font-semibold text-sm hover:bg-black hover:text-white transition"
          >
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-xs text-gray-400 text-center mt-6">
            Authentication will be added later
          </p>
        </div>
      </div>
    </div>
  );
}