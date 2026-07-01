import { useState} from "react";
import { Link } from "react-router-dom";
import "../styles/Signup.css";
import {createToken, signupUser} from "../services/authService.js"
import axios from 'axios'


function Signup() {
   const  API = import.meta.env.VITE_API

    const [formData, setFormData] = useState({

        firstName:"",
        lastName:"",
        email:"",
        phone:"",
        password:"",
        confirmPassword:"",
        role:"customer"

    });

    const handleChange=(e)=>{

        setFormData({

            ...formData,

            [e.target.name]:e.target.value

        });

    };

    const handleSubmit=(e)=>{

        e.preventDefault();

        console.log(formData);


    };



    return(

        <div className="signup-container">

            <div className="signup-card">

                <h1>Create Account</h1>

                <form onSubmit={handleSubmit}>

                    <input
                    name="firstName"
                    placeholder="First Name"
                    onChange={handleChange}
                    />

                    <input
                    name="lastName"
                    placeholder="Last Name"
                    onChange={handleChange}
                    />

                    <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    />

                    <input
                    name="phone"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    />

                    <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    />

                    <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    />

                    <select
                    name="role"
                    onChange={handleChange}
                    >

                        <option value="customer">
                            Customer
                        </option>

                        <option value="driver">
                            Driver
                        </option>

                    </select>

                    <button>

                        Register

                    </button>

                </form>

                <p>

                    Already have an account?

                    <Link to="/login">

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );
}

export default Signup;