
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService.js";
import "../styles/Login.css";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const data = await forgotPassword(email);

            setMessage(data.message);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to send reset link. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>Nation Cabs</h1>

                <h2>Forgot Password?</h2>

                <p>
                    Enter your registered email address.
                    We will send you a link to reset your password.
                </p>

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                </form>

                <p>
                    Remember your password?{" "}
                    <Link to="/">Back to Login</Link>
                </p>

            </div>

        </div>
    );
}

export default ForgotPassword;
