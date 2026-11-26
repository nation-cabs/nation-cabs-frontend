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
        const status = String(booking.booking_status ?? "")
            .trim()
            .toLowerCase();

        // Exclude bookings that are still awaiting confirmation.
        if (status === "pending") return false;

        // Include confirmed and assigned bookings, even if the trip
        // has not happened yet.
        const visibleStatuses = [
            "confirmed",
            "driver assigned",
            "completed",
            "cancelled",
            "canceled",
            "rejected"
        ];

        const pickupDate = new Date(booking.pickup_datetime);

        const isPast =
            !Number.isNaN(pickupDate.getTime()) &&
            pickupDate < now;

        return visibleStatuses.includes(status) || isPast;
    })
    .sort(
        (a, b) =>
            new Date(b.pickup_datetime) - new Date(a.pickup_datetime)
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

    const formatCurrency = (value) => {
        if (value === null || value === undefined) {
            return "N/A";
        }

        return Number(value).toLocaleString("en-ZA", {
            style: "currency",
            currency: "ZAR"
        });
    };

    const formatDistance = (value) => {
        if (value === null || value === undefined) {
            return "N/A";
        }

        return `${Number(value).toFixed(2)} km`;
    };

    const formatStatus = (status) => {
        if (!status) return "N/A";

        return String(status)
            .replace(/_/g, " ")
            .replace(/\b\w/g, char => char.toUpperCase());
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
                <p role="status">
                    Loading booking history...
                </p>
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
                <div className="booking-history-list">

                    {bookings.map((booking) => (
                        <div
                            className="history-booking-card"
                            key={booking.id}
                        >

                            <div className="history-booking-header">
                                <div>
                                    <h3>
                                        Booking #
                                        {String(booking.id).slice(0, 8)}
                                    </h3>

                                    <p>
                                        {formatDate(
                                            booking.pickup_datetime
                                        )}
                                    </p>
                                </div>

                                <span className="booking-status">
                                    {formatStatus(
                                        booking.booking_status
                                    )}
                                </span>
                            </div>

                            <div className="history-trip-details">

                                <h4>Trip Information</h4>

                                <div className="history-route">
                                    <div className="history-route-item">
                                        <span className="route-dot pickup-dot" />

                                        <div>
                                            <small>Pickup Location</small>
                                            <p>
                                                {booking.pickup_location || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="history-route-item">
                                        <span className="route-dot dropoff-dot" />

                                        <div>
                                            <small>Drop-off Location</small>
                                            <p>
                                                {booking.dropoff_location || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="history-info-grid">

                                    <div>
                                        <small>Distance</small>
                                        <strong>
                                            {formatDistance(
                                                booking.distance_km
                                            )}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>Requested Vehicle</small>
                                        <strong>
                                            {booking.vehicle_type || "N/A"}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>Passengers</small>
                                        <strong>
                                            {booking.passengers ?? "N/A"}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>Total Trip Amount</small>
                                        <strong className="history-total">
                                            {formatCurrency(
                                                booking.total_fare
                                            )}
                                        </strong>
                                    </div>

                                </div>
                            </div>

                            <div className="history-driver-details">

                                <h4>Assigned Driver & Vehicle</h4>

                                {booking.driver_id ? (
                                    <>
                                        <div className="history-info-grid">

                                            <div>
                                                <small>Driver Name</small>
                                                <strong>
                                                    {[
                                                        booking.driver_first_name,
                                                        booking.driver_last_name
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" ") || "N/A"}
                                                </strong>
                                            </div>

                                            <div>
                                                <small>Driver Phone</small>
                                                <strong>
                                                    {booking.driver_phone || "N/A"}
                                                </strong>
                                            </div>

                                            <div>
                                                <small>Vehicle Type</small>
                                                <strong>
                                                    {booking.driver_vehicle_type || "N/A"}
                                                </strong>
                                            </div>

                                            <div>
                                                <small>Registration Number</small>
                                                <strong>
                                                    {booking.driver_registration_number || "Not provided"}
                                                </strong>
                                            </div>

                                        </div>
                                    </>
                                ) : (
                                    <p className="no-driver-message">
                                        No driver has been assigned to this booking.
                                    </p>
                                )}

                            </div>

                            {booking.special_instructions && (
                                <div className="history-instructions">
                                    <small>Special Instructions</small>
                                    <p>
                                        {booking.special_instructions}
                                    </p>
                                </div>
                            )}

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default BookingHistory;
