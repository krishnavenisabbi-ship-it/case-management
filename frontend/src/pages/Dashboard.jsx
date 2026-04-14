import { useEffect } from "react";
import { useNavigate } from "react-router-dom";  
export default function Dashboard() {
  return <h1>DASHBOARD WORKING ✅</h1>;
}

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/login");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Case Management</h1>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-6">

        {/* TITLE */}
        <h2 className="text-2xl font-semibold mb-6">
          Dashboard
        </h2>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Total Cases</h3>
            <p className="text-3xl font-bold mt-2">12</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Active Cases</h3>
            <p className="text-3xl font-bold mt-2">8</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Closed Cases</h3>
            <p className="text-3xl font-bold mt-2">4</p>
          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-left">

            <thead className="bg-gray-200">
              <tr>
                <th className="p-4">Case ID</th>
                <th className="p-4">Client Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Next Hearing</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t">
                <td className="p-4">#001</td>
                <td className="p-4">Ravi Kumar</td>
                <td className="p-4 text-green-600">Active</td>
                <td className="p-4">20 Apr 2026</td>
              </tr>

              <tr className="border-t">
                <td className="p-4">#002</td>
                <td className="p-4">Sita Devi</td>
                <td className="p-4 text-red-600">Closed</td>
                <td className="p-4">—</td>
              </tr>
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}