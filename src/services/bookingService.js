
import axios from "axios";

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
        }
    );

    return response.data;
};