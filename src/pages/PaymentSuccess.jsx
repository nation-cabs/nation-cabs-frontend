
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

function PaymentSuccess() {
    const [searchParams] = useSearchParams();

    const bookingId = searchParams.get("bookingId");

    const [status, setStatus] = useState("checking");
    const [message, setMessage] = useState(
        "Checking your payment with our server..."
    );
    const [attempts, setAttempts] = useState(0);
    const [retryTrigger, setRetryTrigger] = useState(0);

    useEffect(() => {
        if (!bookingId) {
            setStatus("error");
            setMessage("Booking reference is missing.");
            return;
        }

        let cancelled = false;
        let timeoutId;
        let currentAttempt = 0;

        const checkPayment = async () => {
            if (cancelled) return;

            try {
                const response = await axiosInstance.get(
                    `/payments/status/${encodeURIComponent(bookingId)}`
                );

                if (cancelled) return;

                const {
                    paymentStatus,
                    bookingStatus
                } = response.data;

                const payment = String(paymentStatus || "")
                    .trim()
                    .toLowerCase();

                const booking = String(bookingStatus || "")
                    .trim()
                    .toLowerCase();

                // Payment is confirmed by the backend
                if (
                    payment === "payment completed" &&
                    booking === "confirmed"
                ) {
                    setStatus("success");
                    setMessage(
                        "Your payment has been successfully verified and your booking is confirmed."
                    );
                    return;
                }

                // Payment failed or was cancelled
                if (
                    payment === "payment failed" ||
                    payment === "payment cancelled" ||
                    payment === "cancelled"
                ) {
                    setStatus("failed");
                    setMessage(
                        "Your payment was not completed. Please try again or contact support."
                    );
                    return;
                }

                // Payment is still awaiting ITN verification
                currentAttempt += 1;
                setAttempts(currentAttempt);

                if (currentAttempt >= 24) {
                    setStatus("pending");
                    setMessage(
                        "Your payment is still awaiting verification. Please check again shortly."
                    );
                    return;
                }

                setStatus("checking");
                setMessage(
                    "Your payment is being verified. Please wait..."
                );

                timeoutId = setTimeout(checkPayment, 5000);

            } catch (error) {
                if (cancelled) return;

                console.error(
                    "Payment verification error:",
                    error
                );

                // Stop retrying for authentication or missing booking errors
                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403 ||
                    error.response?.status === 404
                ) {
                    setStatus("error");
                    setMessage(
                        error.response.status === 401
                            ? "Your session has expired. Please log in again."
                            : error.response.status === 404
                                ? "We could not find this booking."
                                : "You are not authorized to view this booking."
                    );
                    return;
                }

                currentAttempt += 1;
                setAttempts(currentAttempt);

                if (currentAttempt >= 24) {
                    setStatus("pending");
                    setMessage(
                        "We could not confirm your payment yet. Please try checking again."
                    );
                    return;
                }

                setStatus("checking");
                setMessage(
                    "Unable to reach the payment verification service. Retrying..."
                );

                timeoutId = setTimeout(checkPayment, 5000);
            }
        };

        checkPayment();

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };

    }, [bookingId, retryTrigger]);

    const retryVerification = () => {
        setAttempts(0);
        setStatus("checking");
        setMessage("Checking your payment again...");
        setRetryTrigger(previous => previous + 1);
    };

    return (
        <div className="checkout-container">
            <div className="checkout-card">

                {status === "checking" && (
                    <>
                        <h1>Verifying Payment</h1>

                        <p>{message}</p>

                        <p>
                            Please do not close this page.
                        </p>

                        <p>
                            Verification attempt: {attempts + 1} of 24
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <h1>Payment Successful!</h1>

                        <p>{message}</p>

                        <p>
                            Booking reference: {bookingId}
                        </p>

                        <Link to="/user-dashboard">
                            <button className="pay-button">
                                Return to Dashboard
                            </button>
                        </Link>
                    </>
                )}

                {status === "pending" && (
                    <>
                        <h1>Payment Processing</h1>

                        <p>{message}</p>

                        <button
                            className="pay-button"
                            onClick={retryVerification}
                        >
                            Check Payment Again
                        </button>

                        <br /><br />

                        <Link to="/user-dashboard">
                            Return to Dashboard
                        </Link>
                    </>
                )}

                {status === "failed" && (
                    <>
                        <h1>Payment Not Completed</h1>

                        <p>{message}</p>

                        <Link to="/user-dashboard">
                            <button className="pay-button">
                                Return to Dashboard
                            </button>
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h1>Unable to Verify Payment</h1>

                        <p>{message}</p>

                        <Link to="/user-dashboard">
                            <button className="pay-button">
                                Return to Dashboard
                            </button>
                        </Link>
                    </>
                )}

            </div>
        </div>
    );
}

export default PaymentSuccess;
