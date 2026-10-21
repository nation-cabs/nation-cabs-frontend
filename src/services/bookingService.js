import axiosInstance from "../utils/axiosInstance";

export const createBooking = async (bookingData) => {

    const response = await axiosInstance.post(
        "/bookings",
        bookingData
    );

    return response.data;

};

export const getBookings = async () =>{

     const response = await axiosInstance.get(
        "/bookings");

        return response.data;

}