import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt} from "react-icons/fa";
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
            <FaEnvelope className="contact-icon" />
            <a href="mailto:technicalsupport@nationcabs.co.za">
                technicalsupport@nationcabs.co.za
            </a>
        </p>

        <p>
            <FaPhoneAlt className="contact-icon" />
            <a href="tel:+27 70 424 9809">
                +27 70 424 9809
            </a>
        </p>

         <p>
            <FaMapMarkerAlt className="contact-icon" />
            <a href="https://www.google.com/maps/dir//SANCA+CENTRAL,+88+Marshall+St,+Marshalltown,+Johannesburg,+2107/@-25.9956575,29.0343434,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x1e950f3cfa1b49fd:0x9ebdbb563a9581bf!2m2!1d28.0403616!2d-26.2078883?entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
                88 Marshall St, Marshalltown, Johannesburg, 2107
            </a>
        </p>

    </div>

</section>

  );
}

export default ContactSection;