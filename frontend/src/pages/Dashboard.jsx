import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // ✅ Dummy case data
  const cases = [
    { id: "#001", name: "Ravi Kumar", status: "Active", date: "20 Apr 2026" },
    { id: "#002", name: "Sita Devi", status: "Closed", date: "-" },
    { id: "#003", name: "Arjun Singh", status: "Active", date: "25 Apr 2026" },
  ];

  // ✅ Stats calculation
  const stats = {
    total: cases.length,
    active: cases.filter(c => c.status === "Active").length,
    closed: cases.filter(c => c.status === "Closed").length,
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
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

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-8">

        <h2 className="text-2xl font-semibold mb-6">
          Dashboard
        </h2>

        {/* STATS CARDS */}
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

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">

            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3">Case ID</th>
                <th className="px-6 py-3">Client Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Next Hearing</th>
              </tr>
            </thead>

            <tbody>
              {cases.map((c, i) => (
                <tr key={i} className="border-t">
                  <td className="px-6 py-4">{c.id}</td>
                  <td className="px-6 py-4">{c.name}</td>
                  <td className="px-6 py-4">
                    <span className={c.status === "Active" ? "text-green-600" : "text-red-600"}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{c.date}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </main>
    </div>
  );
}