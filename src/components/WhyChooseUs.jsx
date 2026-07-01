import "../styles/WhyChooseUs.css";
import { FaUserShield, FaMapMarkedAlt, FaMoneyBillWave, FaClock , FaShieldAlt, FaLock} from "react-icons/fa";

function WhyChooseUs() {

    const features = [
        {
            icon: <FaUserShield />,
            title: "Verified Drivers",
            text: "All drivers are verified and professionally trained."
        },
        {
            icon: <FaMapMarkedAlt />,
            title: "Reliable Pickups",
            text: "Fast pickups and scheduled transport services."
        },
        {
            icon: <FaMoneyBillWave />,
            title: "Affordable Prices",
            text: "Transparent pricing with no hidden costs."
        },
        {
            icon: <FaClock />,
            title: "24/7 Support",
            text: "Customer support whenever you need assistance."
        },
         {
            icon: <FaShieldAlt />,
            title: "Safe Rides",
            text: "Safety is our top priority with real-time tracking "
        },
         {
            icon: <FaLock/>,
            title: "Secure Payments",
            text: "Multiple payment options with secure transactions."
        }
    ];

    return (

        <section className="why">

            <h2>Why Choose Nation Cabs?</h2>

            <div className="why-grid">

                {features.map((feature,index)=>(

                    <div className="why-card" key={index}>

                        <div className="icon">
                            {feature.icon}
                        </div>

                        <h3>{feature.title}</h3>

                        <p>{feature.text}</p>

                    </div>

                ))}

            </div>

        </section>

    );
}

export default WhyChooseUs;