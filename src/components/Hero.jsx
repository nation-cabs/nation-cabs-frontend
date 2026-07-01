import "../styles/Hero.css";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-overlay">

        <div className="hero-content">

          <h1>Safe, Reliable & Affordable Transport</h1>

          <p>
            Book city rides, airport transfers, chauffeur services,
            and long-distance trips with Nation Cabs.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="book-btn">
              Book a Ride
            </Link>

            <Link to="/signup" className="driver-btn">
              Become a Driver
            </Link>
          </div>

          <div className="hero-features">

            <div> Verified Drivers</div>

            <div> 24/7 Customer Support</div>

            <div> Secure Payments</div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;