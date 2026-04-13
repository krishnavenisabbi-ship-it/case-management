import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">
            Case Management Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Welcome back 👋
          </h2>
          <p className="text-gray-600">
            Manage your legal cases efficiently from your dashboard.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Cases
            </h3>
            <p className="text-3xl font-bold mt-4">0</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-700">
              Active Cases
            </h3>
            <p className="text-3xl font-bold mt-4">0</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-700">
              Closed Cases
            </h3>
            <p className="text-3xl font-bold mt-4">0</p>
          </div>

        </div>

        {/* Future Section Placeholder */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">
            Recent Activity
          </h3>
          <p className="text-gray-500 text-sm">
            No recent activity. Start by adding new cases.
          </p>
        </div>

      </main>
    </div>
  );
}