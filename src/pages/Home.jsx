import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero";
import WhyChooseUs from "../components/WhyChooseUs.jsx";
import Services from "../components/Services.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Footer from "../components/Footer.jsx";
import About from "../components/About.jsx";
import ContactSection from "../components/ContactSection.jsx";



function Home() {
  return (
    <>
      <Navbar />
       <Hero />
       <WhyChooseUs />
       <Services />
       <HowItWorks/>
       <About />
       <ContactSection />
       <Footer />
       
     
    </>
  );
}

export default Home;