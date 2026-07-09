import { useEffect, useState } from "react";
import "../styles/Hero.css";
import { Link } from "react-router-dom";

function Hero() {
   const words = ["Safe", "Reliable", "Affordable"];

  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {

    const currentWord = words[wordIndex];

    const speed = isDeleting ? 70 : 150;

    const timer = setTimeout(() => {

      if (!isDeleting) {

        setText(currentWord.substring(0, text.length + 1));

        if (text === currentWord) {

          setTimeout(() => setIsDeleting(true), 1200);

        }

      } else {

        setText(currentWord.substring(0, text.length - 1));

        if (text === "") {

          setIsDeleting(false);

          setWordIndex((prev) => (prev + 1) % words.length);

        }

      }

    }, speed);

    return () => clearTimeout(timer);

  }, [text, isDeleting, wordIndex]);

  return (
    <section id="hero" className="hero">

      <div className="hero-overlay">

        <div className="hero-content">

         <h1>
   <span className="typed-word">{text}</span>

            <span className="transport"> Transport</span>

</h1>

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