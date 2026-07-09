import {
    FaBullseye,
    FaEye,
    FaHandshake,
    FaUsers,
    FaCarSide,
    FaHeadset,
    FaShieldAlt
} from "react-icons/fa";
import Footer from "../components/Footer";
import "../styles/About.css";
import companyImage from "../assets/img6.jpeg"; 

function About() {
  return (
    <>
   <section id="about" className="about">
      <section className="our-story">

        <div className="story-image">

  <img
    src={companyImage}
    alt="Nation Cabs"
    className="story-img"
  />

</div>
        <div className="story-content">

          <p className="section-label">
            OUR STORY
          </p>

          <h2>
            Connecting People
            Through Better Transportation
          </h2>

          <p>
            Nation Cabs was founded with a simple vision: to provide South
            Africans with a transport service they can rely on every day.
          </p>

          <p>
            Our platform connects passengers with professional drivers while
            ensuring safety, transparency and convenience from booking to
            destination.
          </p>

        </div>

      </section>
      </section>
    </>
  );
}

export default About;