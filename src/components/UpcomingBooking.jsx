
import { useCallback, useEffect, useState } from "react";
import { getBookings } from "../services/bookingService";
import "../styles/UserDashboard.css";

function UpcomingBooking({ refreshKey = 0 }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getBookings();

            // Support either an array or a wrapped API response.
            const allBookings = Array.isArray(response)
                ? response
                : response.bookings ??
                  response.data ??
                  [];

            if (!Array.isArray(allBookings)) {
                throw new Error("Invalid bookings response.");
            }

            const now = new Date();

            const upcoming = allBookings
                .filter((booking) => {
                    const pickupDate = new Date(
                        booking.pickup_datetime
                    );

                    const status = String(
                        booking.booking_status || "pending"
                    ).toLowerCase();

                    const excludedStatuses = [
                        "completed",
                        "cancelled",
                        "canceled",
                        "rejected"
                    ];

                    return (
                        !Number.isNaN(pickupDate.getTime()) &&
                        pickupDate >= now &&
                        !excludedStatuses.includes(status)
                    );
                })
                .sort(
                    (a, b) =>
                        new Date(a.pickup_datetime) -
                        new Date(b.pickup_datetime)
                );

            setBookings(upcoming);
        } catch (err) {
            console.error("Failed to fetch upcoming bookings:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load your upcoming bookings."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings, refreshKey]);

    const formatDate = (value) =>
        new Date(value).toLocaleDateString("en-ZA", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    const formatTime = (value) =>
        new Date(value).toLocaleTimeString("en-ZA", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });

    return (
        <div className="booking-card upcoming-bookings">
            <div className="upcoming-bookings-header">
                <h2>Upcoming Bookings</h2>

                <button
                    type="button"
                    className="refresh-bookings-button"
                    onClick={fetchBookings}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            {loading && (
                <p role="status">Loading your bookings...</p>
            )}

            {!loading && error && (
                <div className="booking-error" role="alert">
                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={fetchBookings}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && bookings.length === 0 && (
                <div className="no-upcoming-bookings">
                    <p className="upcoming-empty-icon"></p>
                    <h3>No upcoming bookings</h3>
                    <p>
                        Once you book a ride, your upcoming
                        journey will appear here.
                    </p>
                </div>
            )}

            {!loading && !error && bookings.length > 0 && (
                <div className="upcoming-bookings-list">
                    {bookings.map((booking) => (
                        <article
                            className="upcoming-booking-item"
                            key={booking.id ?? booking.booking_id}
                        >
                            <div className="upcoming-booking-top">
                                <span className="booking-date">
                                    {formatDate(
                                        booking.pickup_datetime
                                    )}
                                </span>

                               <span className="booking-status">
                               {booking.booking_status || "Pending"}
                             </span>
                             
                            </div>

                            <p>
                                <strong>Time:</strong>{" "}
                                {formatTime(booking.pickup_datetime)}
                            </p>

                            <p>
                                <strong>Pickup:</strong>{" "}
                                {booking.pickup_location}
                            </p>

                            <p>
                                <strong>Destination:</strong>{" "}
                                {booking.dropoff_location}
                            </p>

                            <p>
                                <strong>Passengers:</strong>{" "}
                                {booking.passengers}
                            </p>

                            <p>
                                <strong>Vehicle:</strong>{" "}
                                {booking.vehicle_type}
                            </p>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UpcomingBooking;

