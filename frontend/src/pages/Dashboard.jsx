import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard loaded");
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Logout
        </button>
      </div>

      {/* Welcome Section */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Welcome to Case Management System
        </h2>
        <p className="text-gray-600">
          You can manage your cases here.
        </p>
      </div>

      {/* Dummy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-lg mb-2">Total Cases</h3>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-lg mb-2">Active Cases</h3>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold text-lg mb-2">Closed Cases</h3>
          <p className="text-2xl font-bold">0</p>
        </div>

      </div>
    </div>
  );
}