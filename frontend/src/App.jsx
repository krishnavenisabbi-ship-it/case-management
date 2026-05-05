import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {/* HEADER */}
      {!isLoginPage && <Header />}

      {/* MAIN CONTENT */}
      <main className={`${!isLoginPage ? "pt-[90px]" : ""}`}>
        <div className="max-w-[1200px] mx-auto px-4">

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>

        </div>
      </main>
    </>
  );
}

export default App;