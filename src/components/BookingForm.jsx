
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../services/bookingService.js";
import "../styles/UserDashboard.css"

function BookingForm() {

    const navigate = useNavigate();

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

        try {

            const response = await createBooking(formData);

            alert(response.message);
              alert("You've successfully placed you booking. Make sure to check your dashboard for your booking updates.");

            navigate("/upcoming-bookings");

        }

        catch (error) {

            console.error(error);

            alert(

                error.response?.data?.message ||

                "Unable to create booking."

            );

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

                <button type="submit">

                    Book Ride

                </button>

            </form>

        </div>

    );

}

export default BookingForm;