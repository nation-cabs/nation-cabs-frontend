
import { Link } from "react-router-dom";

function PaymentCancel() {
    return (
        <div className="checkout-container">
            <div className="checkout-card">

                <h1>Payment Cancelled</h1>

                <p>
                    Your payment was not completed.
                </p>

                <p>
                    You can return to your dashboard and
                    review your booking.
                </p>

                <Link to="/user-dashboard">
                    <button className="pay-button">
                        Return to Dashboard
                    </button>
                </Link>

            </div>
        </div>
    );
}

export default PaymentCancel;
