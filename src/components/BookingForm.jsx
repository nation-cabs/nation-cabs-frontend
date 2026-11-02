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
        vehicle_type: "",
        special_instructions: ""
    });

    // Available vehicles
    const vehicles = [
        {
            value: "Suzuki",
            label: "Suzuki 7 Seater",
            passengers: "Up to 7 passengers"
        },
        {
            value: "Suzuki Dzire",
            label: "Suzuki Dzire 1.2 GA MT",
            passengers: "Up to 4 passengers"
        },
        {
            value: "Hyundai",
            label: "Hyundai H1",
            passengers: "9-12 passengers"
        },
        {
            value: "Kia piacanto",
            label: "Kia Picanto",
            passengers: "Up to 4 passengers"
        }
    ];

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Submit booking
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (!formData.vehicle_type) {
            alert("Please select a vehicle.");
            return;
        }

        setLoading(true);

        try {
            const bookingData = {
                ...formData,
                passengers: Number(formData.passengers)
            };

            const response = await createBooking(bookingData);

            const bookingId =
                response?.booking?.id ??
                response?.booking?._id ??
                response?.bookingId;

            if (!bookingId) {
                throw new Error(
                    "Booking reference was not returned by the server."
                );
            }

            // Reset form
            setFormData({
                pickup_location: "",
                dropoff_location: "",
                pickup_datetime: "",
                passengers: 1,
                vehicle_type: "",
                special_instructions: ""
            });

            // Refresh bookings
            if (onBookingCreated) {
                await onBookingCreated();
            }

            // Payment confirmation
            const proceedToPayment = window.confirm(
                "Booking submitted successfully!\n\n" +
                `Booking reference: ${bookingId}\n\n` +
                "Would you like to continue to payment now?"
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
                "Unable to create booking. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="booking-card">

            <h2>Book a Ride</h2>

            <form onSubmit={handleSubmit}>

                {/* Pickup Location */}
                <label>Pickup Location</label>

                <input
                    type="text"
                    name="pickup_location"
                    placeholder="Enter pickup location"
                    value={formData.pickup_location}
                    onChange={handleChange}
                    required
                />

                {/* Destination */}
                <label>Destination</label>

                <input
                    type="text"
                    name="dropoff_location"
                    placeholder="Enter destination"
                    value={formData.dropoff_location}
                    onChange={handleChange}
                    required
                />

                {/* Pickup Date and Time */}
                <label>Pickup Date and Time</label>

                <input
                    type="datetime-local"
                    name="pickup_datetime"
                    value={formData.pickup_datetime}
                    onChange={handleChange}
                    required
                />

                {/* Number of Passengers */}
                <label>Number of Passengers</label>

                <input
                    type="number"
                    name="passengers"
                    min="1"
                    max="20"
                    value={formData.passengers}
                    onChange={handleChange}
                    required
                />

                {/* Vehicle Selection */}
                <label>Select Your Preferred Vehicle</label>

                <select
                    name="vehicle_type"
                    value={formData.vehicle_type}
                    onChange={handleChange}
                    required
                >
                    <option value="">
                        -- Choose a Vehicle --
                    </option>

                    {vehicles.map((vehicle) => (
                        <option
                            key={vehicle.value}
                            value={vehicle.value}
                        >
                            {vehicle.label} - {vehicle.passengers}
                        </option>
                    ))}
                </select>

                {/* Special Instructions */}
                <label>Special Instructions (Optional)</label>

                <textarea
                    name="special_instructions"
                    placeholder="Any additional information for your driver?"
                    value={formData.special_instructions}
                    onChange={handleChange}
                />

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Submitting Booking..."
                        : "Book My Ride"}
                </button>

            </form>
        </div>
    );
}

export default BookingForm;
