import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo-cropped.png";

const Header = () => {
  return (
    <header className="header">

      {/* LOGO */}
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

      {/* LOGIN BUTTON */}
      <div className="header-btn">
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
      </div>

    </header>
  );
};

export default Header;
