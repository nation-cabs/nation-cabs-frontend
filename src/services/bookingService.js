

import axios from "axios";

<<<<<<< HEAD
const API_URL = import.meta.env.VITE_API || "http://localhost:5000/api";

const getAuthHeaders = () => {
    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("userToken");

    if (!token) {
        throw new Error("No authentication token found. Please log in again.");
    }

    return {
        Authorization: `Bearer ${token}`,
    };
};

export const getBookings = async () => {
    const response = await axios.get(`${API_URL}/bookings`, {
        headers: getAuthHeaders(),
    });

    return response.data;
};

export const createBooking = async (bookingData) => {
    const response = await axios.post(
        `${API_URL}/bookings`,
        bookingData,
        {
            headers: getAuthHeaders(),
=======
const API = import.meta.env.VITE_API || "http://localhost:5000/api";

const getAuthConfig = () => {
    const token = localStorage.getItem("userToken");

    return {
        headers: {
            Authorization: `Bearer ${token}`
>>>>>>> 3e34dd9 (Update dashboard, booking and authentication)
        }
    };
};

export const getBookings = async () => {
    const response = await axios.get(
        `${API}/bookings`,
        getAuthConfig()
    );
    return response.data;
<<<<<<< HEAD
};
=======
};


export const createBooking = async (bookingData) => {
    try {
        const response = await axios.post(
            `${API}/bookings`,
            bookingData,
            getAuthConfig()
        );

        return response.data;
    } catch (error) {
        console.error(
            "Booking failed:",
            error.response?.data?.message || error.message
        );

        throw error;
    }
};
>>>>>>> 3e34dd9 (Update dashboard, booking and authentication)
