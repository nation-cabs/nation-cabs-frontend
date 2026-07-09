import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import logo from "../assets/img6.jpeg";

function Navbar() {
  return (
    <nav className="navbar">

     <div className="logo">

    <Link to="/" className="logo-link">

        <img
            src={logo}
            alt="Nation Cabs Logo"
            className="logo-image"
        />

        <span className="logo-text">
            Nation Cabs
        </span>

    </Link>

</div>

      <ul className="nav-links">
    <li><a href="#home">Home</a></li>
    <li><a href="#services">Services</a></li>
    <li><a href="#about">About</a></li>
    <li><a href="#contact">Contact</a></li>
</ul>

      <div className="nav-buttons">
        <Link to="/login" className="login-btn">
          Login
        </Link>

        <Link to="/signup" className="register-btn">
          Register
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;