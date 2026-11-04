import axios from "axios";

const API = import.meta.env.VITE_API;

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

    return response.data;
};

// Forgot Password
export const forgotPassword = async (email) => {
    const response = await axios.post(
        `${API}/auth/forgot-password`,
        { email }
    );

    return response.data;
};

// Reset Password
export const resetPassword = async (
    token,
    password,
    confirmPassword
) => {
    const response = await axios.post(
        `${API}/auth/reset-password/${token}`,
        {
            password,
            confirmPassword
        }
    );

    return response.data;
};


