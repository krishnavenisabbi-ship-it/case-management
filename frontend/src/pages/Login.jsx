import { GoogleLogin } from "@react-oauth/google";

export default function Login() {

  // ✅ SUCCESS HANDLER (THIS IS WHAT YOU WANT)
  const handleSuccess = (response) => {
    console.log("LOGIN SUCCESS", response);

    // You can process token here later
    const token = response.credential;

    // Temporary redirect
    window.location.href = "/dashboard";
  };

  // ❌ ERROR HANDLER
  const handleError = () => {
    console.log("LOGIN FAILED");
  };

  return (
    <div className="min-h-screen flex">

      {/* Left side */}
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

          <h1 className="text-2xl font-bold mb-2">
            CASE MANAGEMENT
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            SYSTEM
          </p>

          <h2 className="text-3xl font-bold mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 mb-8">
            Sign in with Google
          </p>

          {/* ✅ Google Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>

        </div>
      </div>
    </div>
  );
}