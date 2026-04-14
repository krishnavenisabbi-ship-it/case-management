import { GoogleLogin } from "@react-oauth/google";

export default function Login() {

  const handleSuccess = (response) => {
    console.log("LOGIN SUCCESS", response);
    window.location.assign("/dashboard");
  };

  const handleError = () => {
    console.log("LOGIN FAILED");
  };

  return (
    <div className="flex justify-center mt-20">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}