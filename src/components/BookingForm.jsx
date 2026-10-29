

import { useState } from "react";
import { createBooking } from "../services/bookingService.js";
import "../styles/UserDashboard.css";
import "../styles/BookingForm.css";

function BookingForm({ onBookingCreated }) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        pickup_location: "",
        dropoff_location: "",
        pickup_datetime: "",
        passengers: 1,
        vehicle_type: "Sedan",
        special_instructions: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await createBooking(formData);

            // The backend now returns both booking and bookingId.
            const booking = response?.booking;
            const bookingId = booking?.id ?? response?.bookingId;

            if (!bookingId) {
                throw new Error(
                    "The booking was created, but the booking reference was not returned."
                );
            }

            // Clear the form after the booking has been saved.
            setFormData({
                pickup_location: "",
                dropoff_location: "",
                pickup_datetime: "",
                passengers: 1,
                vehicle_type: "Sedan",
                special_instructions: ""
            });

            // Refresh dashboard bookings if a callback was provided.
            if (onBookingCreated) {
                await onBookingCreated();
            }

            const proceedToPayment = window.confirm(
                "Booking submitted successfully!\n\n" +
                `Booking reference: ${bookingId}\n\n` +
                "Would you like to continue to payment now?\n\n" +
                "Select OK to pay now or Cancel to pay later."
            );

            if (proceedToPayment) {
                window.location.assign(
                    `/checkout/${encodeURIComponent(bookingId)}`
                );
            }
        } catch (error) {
            console.error("Booking error:", error);

            alert(
                error.response?.data?.message ||
                error.message ||
                "Unable to create booking."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-card">
            <h2>Book a Ride</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="pickup_location"
                    placeholder="Pickup Location"
                    value={formData.pickup_location}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="dropoff_location"
                    placeholder="Destination"
                    value={formData.dropoff_location}
                    onChange={handleChange}
                    required
                />

                <input
                    type="datetime-local"
                    name="pickup_datetime"
                    value={formData.pickup_datetime}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="passengers"
                    min="1"
                    max="20"
                    value={formData.passengers}
                    onChange={handleChange}
                    required
                />

                <select
                    name="vehicle_type"
                    value={formData.vehicle_type}
                    onChange={handleChange}
                >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Minibus">Minibus</option>
                    <option value="Luxury">Luxury</option>
                </select>

                <textarea
                    name="special_instructions"
                    placeholder="Special Instructions"
                    value={formData.special_instructions}
                    onChange={handleChange}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Booking..." : "Book Ride"}
                </button>
            </form>
        </div>
    );
}

export default BookingForm;
