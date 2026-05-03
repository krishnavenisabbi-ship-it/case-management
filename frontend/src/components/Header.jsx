import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo.png";   // 👈 import

const Header = () => {
  return (
    <header className="header">

      {/* LOGO IMAGE */}
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      {/* NAVIGATION */}
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/features">Features</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <button className="login-btn">Login</button>

    </header>
  );
};

export default Header;