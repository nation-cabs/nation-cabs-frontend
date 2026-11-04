
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService.js";
import "../styles/Login.css";

function ResetPassword() {

    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        setLoading(true);

        try {

            const data = await resetPassword(
                token,
                password,
                confirmPassword
            );

            setMessage(data.message);

            setTimeout(() => {
                navigate("/");
            }, 2500);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Password reset failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>Nation Cabs</h1>

                <h2>Reset Password</h2>

                <p>Enter your new password below.</p>

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
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={8}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>

                </form>

                <p>
                    <Link to="/">Back to Login</Link>
                </p>

            </div>

        </div>
    );
}

export default ResetPassword;
