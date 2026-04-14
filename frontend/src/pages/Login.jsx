import { GoogleLogin } from "@react-oauth/google";
import { useRef } from "react";

export default function Login() {
  const hasLoggedIn = useRef(false);

  const handleSuccess = (response) => {
    if (hasLoggedIn.current) return;
    hasLoggedIn.current = true;

    console.log("LOGIN SUCCESS", response);

    window.location.assign("/dashboard");
  };

  const handleError = () => {
    console.log("LOGIN FAILED");
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Login</h2>

          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </div>
      </div>
    </div>
  );
}