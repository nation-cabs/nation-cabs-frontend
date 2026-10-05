import axiosInstance from "../utils/axiosInstance";

export const createBooking = async (bookingData) => {

    const response = await axiosInstance.post(
        "/bookings",
        bookingData
    );

    return response.data;

};