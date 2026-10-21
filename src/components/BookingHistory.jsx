
import { useCallback, useEffect, useState } from "react";
import { getBookings } from "../services/bookingService.js";
import "../styles/BookingHistory.css";

function BookingHistory({ refreshKey = 0 }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getBookings();

            const allBookings = Array.isArray(response)
                ? response
                : response?.bookings ??
                  response?.data?.bookings ??
                  response?.data ??
                  [];

            if (!Array.isArray(allBookings)) {
                throw new Error("Invalid bookings response.");
            }

            const now = new Date();

            const history = allBookings
                .filter((booking) => {
                    // Exclude all pending bookings.
                    const status = String(
                        booking.booking_status ?? ""
                    ).trim().toLowerCase();

                    if (status === "pending") {
                        return false;
                    }

                    const finalStatuses = [
                        "completed",
                        "cancelled",
                        "canceled",
                        "rejected"
                    ];

                    const pickupDate = new Date(
                        booking.pickup_datetime
                    );

                    const isPast =
                        !Number.isNaN(pickupDate.getTime()) &&
                        pickupDate < now;

                    // Include completed/cancelled/rejected bookings
                    // and other non-pending bookings with past dates.
                    return finalStatuses.includes(status) || isPast;
                })
                .sort(
                    (a, b) =>
                        new Date(b.pickup_datetime) -
                        new Date(a.pickup_datetime)
                );

            setBookings(history);
        } catch (err) {
            console.error("Failed to fetch booking history:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load booking history."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory, refreshKey]);

    const formatDate = (value) => {
        if (!value) return "N/A";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return "N/A";

        return date.toLocaleString("en-ZA", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    };

    return (
        <div className="booking-card history">
            <div className="history-header">
                <h2>Booking History</h2>

                <button
                    type="button"
                    onClick={fetchHistory}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            {loading && (
                <p role="status">Loading booking history...</p>
            )}

            {!loading && error && (
                <div className="booking-error" role="alert">
                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={fetchHistory}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!loading && !error && bookings.length === 0 && (
                <div className="history-empty">
                    <h3>No previous bookings</h3>
                    <p>
                        Your completed rides and other past bookings
                        will appear here.
                    </p>
                </div>
            )}

            {!loading && !error && bookings.length > 0 && (
                <div className="history-table-wrapper">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Pickup Date &amp; Time</th>
                                <th>Pickup</th>
                                <th>Destination</th>
                                <th>Vehicle</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bookings.map((booking) => (
                                <tr
                                    key={
                                        booking.id ??
                                        booking.booking_id
                                    }
                                >
                                    <td>
                                        {booking.id
                                            ? String(booking.id).slice(0, 8)
                                            : booking.booking_id
                                            ? String(
                                                  booking.booking_id
                                              ).slice(0, 8)
                                            : "N/A"}
                                    </td>

                                    <td>
                                        {formatDate(
                                            booking.pickup_datetime
                                        )}
                                    </td>

                                    <td>
                                        {booking.pickup_location || "N/A"}
                                    </td>

                                    <td>
                                        {booking.dropoff_location || "N/A"}
                                    </td>

                                    <td>
                                        {booking.vehicle_type || "Sedan"}
                                    </td>

                                    <td>
                                        {booking.booking_status || "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default BookingHistory;