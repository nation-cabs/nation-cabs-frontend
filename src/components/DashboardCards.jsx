


import { useCallback, useEffect, useState } from "react";
import { getBookings } from "../services/bookingService.js";

function DashboardCards({ refreshKey = 0 }) {
    const [stats, setStats] = useState([
        {
            title: "Upcoming",
            count: 0,
            icon: "🗓️",
            type: "upcoming",
            description: "Scheduled rides",
        },
        {
            title: "Completed",
            count: 0,
            icon: "✓",
            type: "completed",
            description: "Successfully completed",
        },
        {
            title: "Pending",
            count: 0,
            icon: "◷",
            type: "pending",
            description: "Awaiting confirmation",
        },
        {
            title: "Cancelled",
            count: 0,
            icon: "×",
            type: "cancelled",
            description: "Cancelled rides",
        },
    ]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getBookings();

            const allBookings = Array.isArray(response)
                ? response
                : response?.bookings ??
                  response?.data?.bookings ??
                  response?.data?.data ??
                  response?.data ??
                  [];

            if (!Array.isArray(allBookings)) {
                throw new Error("Invalid bookings response.");
            }

            const now = new Date();

            const counts = {
                upcoming: 0,
                completed: 0,
                pending: 0,
                cancelled: 0,
            };

            allBookings.forEach((booking) => {
                const status = String(
                    booking.booking_status ??
                    booking.status ??
                    ""
                )
                    .trim()
                    .toLowerCase();

                const pickupDate = new Date(
                    booking.pickup_datetime
                );

                const isFuture =
                    !Number.isNaN(pickupDate.getTime()) &&
                    pickupDate >= now;

                if (
                    isFuture &&
                    ![
                        "completed",
                        "cancelled",
                        "canceled",
                        "rejected",
                    ].includes(status)
                ) {
                    counts.upcoming++;
                }

                if (status === "completed") {
                    counts.completed++;
                }

                if (status === "pending") {
                    counts.pending++;
                }

                if (
                    status === "cancelled" ||
                    status === "canceled"
                ) {
                    counts.cancelled++;
                }
            });

            setStats((previousStats) =>
                previousStats.map((stat) => ({
                    ...stat,
                    count: counts[stat.type],
                }))
            );
        } catch (err) {
            console.error(
                "Failed to fetch dashboard bookings:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load booking statistics."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings, refreshKey]);

    return (
        <div>
            {error && (
                <p className="booking-error" role="alert">
                    {error}
                    <button
                        type="button"
                        onClick={fetchBookings}
                    >
                        Try Again
                    </button>
                </p>
            )}

            <div className="stats">
                {stats.map((stat) => (
                    <div
                        className={`stat-card ${stat.type}`}
                        key={stat.type}
                    >
                        <div className="stat-card-top">
                            <span className="stat-title">
                                {stat.title}
                            </span>

                            <span
                                className="stat-icon"
                                aria-hidden="true"
                            >
                                {stat.icon}
                            </span>
                        </div>

                        <h2>
                            {loading ? "..." : stat.count}
                        </h2>

                        <p className="stat-description">
                            {stat.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashboardCards;
