

import { useCallback, useEffect, useState } from "react";
import { getBookings } from "../services/bookingService.js";

function DashboardCards({ refreshKey = 0 }) {
    const [stats, setStats] = useState([
        { title: "Upcoming", count: 0, icon: "🗓️", type: "upcoming" },
        { title: "Completed", count: 0, icon: "✓", type: "completed" },
        { title: "Pending", count: 0, icon: "◷", type: "pending" },
        { title: "Cancelled", count: 0, icon: "×", type: "cancelled" },
    ]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await getBookings();

            // Support arrays and common API response structures.
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
                    booking.booking_status ?? ""
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

            setStats([
                {
                    title: "Upcoming",
                    count: counts.upcoming,
                    icon: "🗓️",
                    type: "upcoming",
                },
                {
                    title: "Completed",
                    count: counts.completed,
                    icon: "✓",
                    type: "completed",
                },
                {
                    title: "Pending",
                    count: counts.pending,
                    icon: "◷",
                    type: "pending",
                },
                {
                    title: "Cancelled",
                    count: counts.cancelled,
                    icon: "×",
                    type: "cancelled",
                },
            ]);
        } catch (err) {
            console.error("Failed to fetch dashboard bookings:", err);

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
                            {stat.title} bookings
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DashboardCards;
