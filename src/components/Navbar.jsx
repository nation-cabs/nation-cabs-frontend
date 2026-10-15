import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "../styles/Navbar.css";
import logo from "../assets/img6.jpeg";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userToken");
  };

  const handleLogout = () => {
    setMenuOpen(false);

    const confirmed = window.confirm("Are you sure you want to logout?");

    if (confirmed) {
      logout();
      navigate("/login", { replace: true });
    }
  };
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userToken");
  };

  const handleLogout = () => {
    setMenuOpen(false);

    const confirmed = window.confirm("Are you sure you want to logout?");

    if (confirmed) {
      logout();
      navigate("/login", { replace: true });
    }
  };
              
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-link" onClick={() => setMenuOpen(false)}>
          <img
        <Link to="/" className="logo-link" onClick={() => setMenuOpen(false)}>
          <img
            src={logo}
            alt="Nation Cabs Logo"
            className="logo-image"
          />
          <span className="logo-text">Nation Cabs</span>
        </Link>
      </div>
          />
          <span className="logo-text">Nation Cabs</span>
        </Link>
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li>
          <a href="#home" onClick={() => setMenuOpen(false)}>
            Home
          </a>
        </li>
        <li>
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </a>
        </li>
        <li>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
        </li>
        <li>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </li>
         <div className="mobile-buttons">
        <li>
          <a href="#home" onClick={() => setMenuOpen(false)}>
            Home
          </a>
        </li>
        <li>
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </a>
        </li>
        <li>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
        </li>
        <li>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </li>
         <div className="mobile-buttons">
          <Link
            to="/login"
            className="login-btn"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="register-btn"
            onClick={() => setMenuOpen(false)}
          >
            Register
          </Link>

           <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
           <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
        </div>
      </ul>

      <div className="nav-buttons">
        <Link to="/login" className="login-btn" onClick={() => setMenuOpen(false)}>
        <Link to="/login" className="login-btn" onClick={() => setMenuOpen(false)}>
          Login
        </Link>
        <Link to="/signup" className="register-btn" onClick={() => setMenuOpen(false)}>
        <Link to="/signup" className="register-btn" onClick={() => setMenuOpen(false)}>
          Sign Up
        </Link>
        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
        </button>
      </div>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
}
export default Navbar;
