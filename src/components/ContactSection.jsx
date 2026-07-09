import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import "../styles/ContactSection.css";

function ContactSection() {
  return (
<section id="contact" className="contact">

    <h2 className="section-title">Contact</h2>

    <div className="contact-details">

        <p>
            <FaEnvelope className="contact-icon" />
            <a href="mailto:info@nationcabs.co.za">
                info@nationcabs.co.za
            </a>
        </p>

        <p>
            <FaPhoneAlt className="contact-icon" />
            <a href="tel:+27 70 424 9809">
                +27 70 424 9809
            </a>
        </p>

    </div>

</section>

  );
}

export default ContactSection;