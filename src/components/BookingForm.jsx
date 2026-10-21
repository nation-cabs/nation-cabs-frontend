
import { useState } from "react";

import { createBooking } from "../services/bookingService.js";
import "../styles/UserDashboard.css"
import "../styles/BookingForm.css"; // Import the CSS file for BookingForm


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

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const response = await createBooking(formData);

        alert(
            response.message ||
            "Your ride has been booked successfully!"
        );

        setFormData({
            pickup_location: "",
            dropoff_location: "",
            pickup_datetime: "",
            passengers: 1,
            vehicle_type: "Sedan",
            special_instructions: ""
        });

        if (onBookingCreated) {
            await onBookingCreated();
        }
    } catch (error) {
        console.error("Booking error:", error);

        alert(
            error.response?.data?.message ||
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
                    onChange={handleChange}
                    required
                />

                <input
                    type="datetime-local"
                    name="pickup_datetime"
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