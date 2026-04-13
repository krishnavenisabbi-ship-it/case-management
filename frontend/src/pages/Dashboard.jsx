import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Case Management</h1>
        <button
          onClick={() => navigate("/login")}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Dashboard
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-gray-600">Total Cases</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-gray-600">Active Cases</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-gray-600">Closed Cases</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>

        </div>

      </div>
    </div>
  );
}