import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import { loginUser} from "../services/authService.js";
import { useNavigate } from "react-router-dom";
import { saveToken, saveUser } from "../utils/auth.js";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    try {

        const data = await loginUser(formData);

        saveToken(data.token);
        saveUser(data.user);

        switch (data.user.role) {

            case "customer":
                navigate("/user-dashboard");
                break;

            case "driver":
                navigate("/driver-dashboard");
                break;

            case "admin":
                navigate("/admin-dashboard");
                break;

                 case "hr":
                navigate("/hr-dashboard");
                break;

            default:
                navigate("/");
        }

    } catch (err) {

        console.error(err);

        setError(
            err.response?.data?.message ||
            "Login failed."
        );

    }

};

    return (

        <div className="login-container">

            <div className="login-card">


                <h1>Nation Cabs</h1>

                <h2>Welcome Back</h2>

                <p>Sign in to continue.</p>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Login
                    </button>

                </form>

                <p>

                    Don't have an account?

                    <Link to="/signup">

                        Register

                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Login;