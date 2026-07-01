import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";

function Login() {

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

    const handleSubmit = (e) => {

        e.preventDefault();

        console.log(formData);

        

    };

    return (

        <div className="login-container">

            <div className="login-card">

                <h1>Nation Cabs</h1>

                <h2>Welcome Back</h2>

                <p>Sign in to continue.</p>

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