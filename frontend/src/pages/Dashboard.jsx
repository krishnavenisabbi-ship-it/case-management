import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">

        <h1 className="text-2xl font-bold mb-4">
          DASHBOARD WORKING ✅
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>
    </div>
  );
}