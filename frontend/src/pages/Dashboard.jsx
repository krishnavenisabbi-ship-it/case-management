import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const cases = [
    { id: "#001", name: "Ravi Kumar", status: "Active", date: "20 Apr 2026" },
    { id: "#002", name: "Sita Devi", status: "Closed", date: "-" },
    { id: "#003", name: "Arjun Singh", status: "Active", date: "25 Apr 2026" },
  ];

  const stats = {
    total: cases.length,
    active: cases.filter(c => c.status === "Active").length,
    closed: cases.filter(c => c.status === "Closed").length,
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ✅ TAILWIND TEST */}
      <h1 className="text-5xl text-red-500 bg-yellow-200 p-4">
        TAILWIND WORKING
      </h1>

      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Case Management</h1>

          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
            className="bg-black text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        <h2 className="text-2xl font-semibold mb-6">
          Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500">Total Cases</p>
            <h3 className="text-3xl font-bold mt-2">{stats.total}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500">Active Cases</p>
            <h3 className="text-3xl font-bold mt-2">{stats.active}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500">Closed Cases</p>
            <h3 className="text-3xl font-bold mt-2">{stats.closed}</h3>
          </div>

        </div>

      </main>
    </div>
  );
}