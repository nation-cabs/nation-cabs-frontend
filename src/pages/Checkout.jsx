
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "../styles/Checkout.css";

function Checkout() {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePayment = async () => {
        if (loading) return;

        setLoading(true);
        setError("");

        try {
            // Request payment details from backend
            const response = await axiosInstance.post(
                "/payments/create",
                { bookingId }
            );

            const { paymentUrl, paymentData } = response.data;

            if (!paymentUrl || !paymentData) {
                throw new Error(
                    "Invalid payment response from server."
                );
            }

            // Create PayFast payment form
            const form = document.createElement("form");

            form.method = "POST";
            form.action = paymentUrl;

            Object.entries(paymentData).forEach(([key, value]) => {
                if (value === null || value === undefined) return;

                const input = document.createElement("input");

                input.type = "hidden";
                input.name = key;
                input.value = String(value);

                form.appendChild(input);
            });

            document.body.appendChild(form);

            // Redirect customer to PayFast
            form.submit();

        } catch (err) {
            console.error("Checkout error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to initiate payment. Please try again."
            );

            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">

            <div className="checkout-card">

                <h1>Checkout</h1>

                <p className="checkout-subtitle">
                    Review your booking before proceeding to payment.
                </p>

                <div className="booking-reference">
                    <span>Booking Reference</span>

                    <strong>{bookingId}</strong>
                </div>

                <div className="payment-information">

                    <h3>Payment Information</h3>

                    <p>
                        Your booking fare will be retrieved securely
                        from our server.
                    </p>

                    <p>
                        You will be redirected to PayFast to complete
                        your payment securely.
                    </p>

                    <div className="payment-method">
                        <span>Payment Provider</span>
                        <strong>PayFast</strong>
                    </div>

                    <div className="payment-method">
                        <span>Currency</span>
                        <strong>ZAR (South African Rand)</strong>
                    </div>

                </div>

                {error && (
                    <div className="checkout-error">
                        {error}
                    </div>
                )}

                <button
                    className="pay-button"
                    onClick={handlePayment}
                    disabled={loading}
                >
                    {loading
                        ? "Preparing Payment..."
                        : "Proceed to PayFast"}
                </button>

                <button
                    className="back-button"
                    onClick={() => navigate("/user-dashboard")}
                    disabled={loading}
                >
                    Back to Dashboard
                </button>

                <p className="secure-payment">
                    Secure payment powered by PayFast
                </p>

            </div>

        </div>
    );
}

export default Checkout;
