
import axios from "axios";

const API = import.meta.env.VITE_API || "http://localhost:5000/api";

// Register
export const signupUser = async (userData) => {
    const response = await axios.post(
        `${API}/auth/signup`,
        userData
    );

    return response.data;
};

// Login
export const loginUser = async (credentials) => {
    const response = await axios.post(
        `${API}/auth/login`,
        credentials
    );

    // Save the token returned by the backend
    if (response.data.token) {
        localStorage.setItem("userToken", response.data.token);
    }

    // Save user details
    if (response.data.user) {
        localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
        );
    }

    return response.data;
};


