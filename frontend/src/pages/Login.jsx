import { GoogleLogin } from "@react-oauth/google";
import logo from "../assets/logo.png";

export default function Login() {

  const handleSuccess = (res) => {
    console.log("LOGIN SUCCESS", res);
    localStorage.setItem("user", JSON.stringify(res));
    window.location.assign("/dashboard");
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE (LOCAL LOGO) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center">
        <img
          src={logo}   // ✅ USE LOCAL IMAGE HERE
          alt="Law"
          className="w-[350px]"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center bg-white px-6">

        <div className="max-w-md w-full text-center">

          {/* ✅ ADD LOGO HERE ALSO (STEP 3 POSITION) */}
          <img
            src={logo}
            alt="Law"
            className="w-[120px] mx-auto mb-4"
          />

          <h1 className="text-3xl font-bold mb-2">
            CASE MANAGEMENT
          </h1>

          <p className="text-gray-500 mb-6">
            SYSTEM
          </p>

          <h2 className="text-xl font-semibold mb-4">
            Welcome Back
          </h2>

          <p className="text-gray-500 mb-6">
            Sign in to manage your cases
          </p>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={() => console.log("Login Failed")}
            />
          </div>

        </div>
      </div>
    </div>
  );
}