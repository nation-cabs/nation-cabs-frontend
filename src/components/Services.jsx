import "../styles/Services.css";
import {
  FaPlane,
  FaTaxi,
  FaBriefcase,
  FaRoad,
  FaSchool,
  FaCarSide,
} from "react-icons/fa";

function Services() {
  const services = [
    {
      icon: <FaPlane />,
      title: "Airport Transfers",
      description: "Reliable pickups and drop-offs to all major airports.",
    },
    {
      icon: <FaTaxi />,
      title: "City Rides",
      description: "Quick and comfortable transport within the city.",
    },
    {
      icon: <FaBriefcase />,
      title: "Corporate Travel",
      description: "Professional transport solutions for businesses.",
    },
    {
      icon: <FaRoad />,
      title: "Chauffeur Services",
      description: "Experienced drivers for a premium travel experience.",
    },
    {
      icon: <FaSchool />,
      title: "Local Tour Operation",
      description: "Explore the city with our guided tour services.",
    },
    {
      icon: <FaCarSide />,
      title: "Private Hire",
      description: "Hire a driver and vehicle for special occasions.",
    },
  ];

  return (
    <section className="services">
      <h2>Our Services</h2>

      <div className="services-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="service-icon">{service.icon}</div>

            <h3>{service.title}</h3>

            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;