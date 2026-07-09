import "../styles/HowItWorks.css";

function HowItWorks() {
  return (
    <section className="how-it-works">

      <div className="section-title">
        <p>HOW IT WORKS</p>

        <h2>
          Book your <span>ride</span> in four
          <br />
          simple <span>steps.</span>
        </h2>
      </div>

      <div className="steps-container">

        <div className="step-card">
          <span>STEP 1</span>
          <h3>Book Ride</h3>
        </div>

        <div className="arrow">→</div>

        <div className="step-card">
          <span>STEP 2</span>
          <h3>Driver Assigned</h3>
        </div>

        <div className="arrow">→</div>

        <div className="step-card">
          <span>STEP 3</span>
          <h3>Track Driver</h3>
        </div>

        <div className="arrow">→</div>

        <div className="step-card">
          <span>STEP 4</span>
          <h3>Reach Destination</h3>
        </div>

      </div>

    </section>
  );
}

export default HowItWorks;