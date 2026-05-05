import { Link } from "react-router-dom";
import logo from "../assets/logo-cropped.png";

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-black z-50 shadow-md">
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-[70px]">

        {/* LOGO */}
        <img src={logo} alt="logo" className="h-[50px]" />

        {/* NAV */}
        <nav className="flex gap-6 text-white">
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/features">Features</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        {/* LOGIN BUTTON */}
        <Link
          to="/login"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold"
        >
          Login
        </Link>

      </div>
    </header>
  );
};

export default Header;