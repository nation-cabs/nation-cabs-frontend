
import { useEffect, useState, useCallback } from "react";

import DriverProfile from "../components/DriverProfile";
import "../styles/DriverDashboard.css";

const API_URL = (
    import.meta.env.VITE_API || "http://localhost:5000/api"
).replace(/\/$/, "");

function DriverDashboard() {

    const [activeSection, setActiveSection] = useState("overview");

    const [driver, setDriver] = useState(null);
    const [trips, setTrips] = useState([]);
    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [actionLoading, setActionLoading] = useState("");

    const token = localStorage.getItem("userToken");

    // API request helper
    const apiRequest = async (endpoint, options = {}) => {

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(options.body
                    ? { "Content-Type": "application/json" }
                    : {}),
                ...options.headers
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong.");
        }

        return data;
    };

    // Load driver dashboard information
    const loadDashboard = useCallback(async () => {

        if (!token) {
            setError("Your session has expired. Please log in again.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {

            const results = await Promise.allSettled([
                apiRequest("/driver/profile"),
                apiRequest("/driver/trips"),
                apiRequest("/driver/trip-history")
            ]);

            // Driver profile
            if (results[0].status === "fulfilled") {
                setDriver(results[0].value.driver);
            } else {
                throw results[0].reason;
            }

            // Assigned trips
            if (results[1].status === "fulfilled") {
                setTrips(results[1].value.trips || []);
            } else {
                throw results[1].reason;
            }

            // Trip history
            if (results[2].status === "fulfilled") {
                setHistory(results[2].value.trips || []);
            } else {
                setHistory([]);
            }

        } catch (err) {
            setError(err.message || "Unable to load your dashboard.");
        } finally {
            setLoading(false);
        }

    }, [token]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    // Accept assigned trip
    const handleAcceptTrip = async (tripId) => {

        setActionLoading(tripId);
        setMessage("");
        setError("");

        try {

            const result = await apiRequest(
                `/driver/trips/${tripId}/accept`,
                { method: "PATCH" }
            );

            setMessage(result.message || "Trip accepted successfully.");

            await loadDashboard();

        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading("");
        }
    };

    // Update trip status
    const handleUpdateStatus = async (tripId, status) => {

        setActionLoading(tripId);
        setMessage("");
        setError("");

        try {

            const result = await apiRequest(
                `/driver/trips/${tripId}/status`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        booking_status: status
                    })
                }
            );

            setMessage(result.message || "Trip status updated.");

            await loadDashboard();

        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading("");
        }
    };

    // Get booking ID
    const getTripId = (trip) => trip.id || trip.booking_id;

    // Get booking status
    const getTripStatus = (trip) =>
        trip.booking_status || trip.status || "Assigned";

    // Format booking date
    const formatDate = (date) => {

        if (!date) return "Not specified";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return date;

        return parsedDate.toLocaleString("en-ZA", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    // Driver name
    const getName = () => {

        if (!driver) return "Driver";

        return [
            driver.first_name || driver.firstName,
            driver.last_name || driver.lastName
        ].filter(Boolean).join(" ") || driver.name || "Driver";
    };

    // Trip action buttons
    const renderTripActions = (trip) => {

        const tripId = getTripId(trip);
        const status = String(getTripStatus(trip)).toLowerCase();
        const busy = actionLoading === tripId;

        if (status === "completed" || status === "cancelled") {
            return (
                <span className="driver-no-action">
                    No actions available
                </span>
            );
        }

        if (status === "in progress") {
            return (
                <button
                    className="driver-action-button complete"
                    disabled={busy}
                    onClick={() =>
                        handleUpdateStatus(tripId, "Completed")
                    }
                >
                    {busy ? "Updating..." : "Complete Trip"}
                </button>
            );
        }

        if (status === "accepted" || status === "confirmed") {
            return (
                <button
                    className="driver-action-button start"
                    disabled={busy}
                    onClick={() =>
                        handleUpdateStatus(tripId, "In Progress")
                    }
                >
                    {busy ? "Updating..." : "Start Trip"}
                </button>
            );
        }

        return (
            <button
                className="driver-action-button accept"
                disabled={busy}
                onClick={() => handleAcceptTrip(tripId)}
            >
                {busy ? "Accepting..." : "Accept Trip"}
            </button>
        );
    };

    // Display individual trip
    const renderTripCard = (trip) => (

        <div className="driver-trip-card" key={getTripId(trip)}>

            <div className="driver-trip-heading">
                <h3>Booking #{getTripId(trip)}</h3>

                <span
                    className={`driver-status ${String(getTripStatus(trip))
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                >
                    {getTripStatus(trip)}
                </span>
            </div>

            <div className="driver-trip-details">

                <p>
                    <strong>Pickup:</strong>{" "}
                    {trip.pickup_location || "Not provided"}
                </p>

                <p>
                    <strong>Destination:</strong>{" "}
                    {trip.dropoff_location || "Not provided"}
                </p>

                <p>
                    <strong>Pickup date:</strong>{" "}
                    {formatDate(trip.pickup_datetime)}
                </p>

                <p>
                    <strong>Vehicle:</strong>{" "}
                    {trip.vehicle_type || "Not specified"}
                </p>

                <p>
                    <strong>Passengers:</strong>{" "}
                    {trip.passengers ?? "Not specified"}
                </p>

                {trip.customer_name && (
                    <p>
                        <strong>Customer:</strong> {trip.customer_name}
                    </p>
                )}

                {trip.special_instructions && (
                    <p className="driver-special-instructions">
                        <strong>Special instructions:</strong>{" "}
                        {trip.special_instructions}
                    </p>
                )}

            </div>

            <div className="driver-trip-footer">

                {trip.total_fare != null && (
                    <strong className="driver-trip-fare">
                        Fare: R{Number(trip.total_fare).toFixed(2)}
                    </strong>
                )}

                {renderTripActions(trip)}

            </div>

        </div>
    );

    return (

        <div className="driver-dashboard">

            {/* Sidebar */}
            <aside className="driver-sidebar">

                <h2>Nation Cabs</h2>

                <p className="driver-sidebar-label">
                    DRIVER PORTAL
                </p>

                <ul>

                    <li
                        className={activeSection === "overview" ? "active" : ""}
                        onClick={() => setActiveSection("overview")}
                    >
                        <span>▦</span> Overview
                    </li>

                    <li
                        className={activeSection === "trips" ? "active" : ""}
                        onClick={() => setActiveSection("trips")}
                    >
                        <span>🚕</span> Assigned Trips
                    </li>

                    <li
                        className={activeSection === "history" ? "active" : ""}
                        onClick={() => setActiveSection("history")}
                    >
                        <span>◷</span> Trip History
                    </li>

                    <li
                        className={activeSection === "profile" ? "active" : ""}
                        onClick={() => setActiveSection("profile")}
                    >
                        <span>♙</span> My Profile
                    </li>

                    <li onClick={() => window.location.href = "/logout"}>
                        <span>↪</span> Logout
                    </li>

                </ul>

            </aside>

            {/* Main dashboard */}
            <main className="driver-main">

                <header className="driver-header">

                    <div>

                        <h1>
                            {activeSection === "overview" && "Driver Dashboard"}
                            {activeSection === "trips" && "Assigned Trips"}
                            {activeSection === "history" && "Trip History"}
                            {activeSection === "profile" && "My Profile"}
                        </h1>

                        <p>Welcome back, {getName()}</p>

                    </div>

                    <button
                        className="driver-refresh-button"
                        onClick={loadDashboard}
                        disabled={loading}
                    >
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>

                </header>

                {message && (
                    <div className="driver-message success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="driver-message error">
                        {error}
                    </div>
                )}

                {loading ? (

                    <div className="driver-empty-state">
                        Loading your dashboard...
                    </div>

                ) : (

                    <>

                        {/* Overview */}
                        {activeSection === "overview" && (

                            <>

                                <section className="driver-welcome-card">

                                    <div>
                                        <h2>Hello, {getName()}!</h2>

                                        <p>
                                            Manage your assigned trips and keep
                                            your trip statuses up to date.
                                        </p>
                                    </div>

                                </section>

                                {/* Dashboard statistics */}
                                <section className="driver-stats">

                                    <div className="driver-stat-card">
                                        <span>Assigned Trips</span>
                                        <h2>{trips.length}</h2>
                                    </div>

                                    <div className="driver-stat-card">
                                        <span>Trip History</span>
                                        <h2>{history.length}</h2>
                                    </div>

                                    <div className="driver-stat-card">
                                        <span>In Progress</span>

                                        <h2>
                                            {trips.filter(
                                                trip =>
                                                    String(getTripStatus(trip))
                                                        .toLowerCase() === "in progress"
                                            ).length}
                                        </h2>
                                    </div>

                                </section>

                                {/* Recent assigned trips */}
                                <section className="driver-section">

                                    <div className="driver-section-heading">

                                        <h2>Assigned Trips</h2>

                                        <button
                                            onClick={() =>
                                                setActiveSection("trips")
                                            }
                                        >
                                            View All
                                        </button>

                                    </div>

                                    {trips.length === 0 ? (

                                        <p className="driver-empty-state">
                                            You currently have no assigned trips.
                                        </p>

                                    ) : (

                                        trips.slice(0, 3).map(renderTripCard)

                                    )}

                                </section>

                            </>

                        )}

                        {/* Assigned trips */}
                        {activeSection === "trips" && (

                            <section className="driver-section">

                                <h2>Your Assigned Trips</h2>

                                {trips.length === 0 ? (

                                    <p className="driver-empty-state">
                                        No trips have been assigned to you yet.
                                    </p>

                                ) : (

                                    trips.map(renderTripCard)

                                )}

                            </section>

                        )}

                        {/* Trip history */}
                        {activeSection === "history" && (

                            <section className="driver-section">

                                <h2>Previous Trips</h2>

                                {history.length === 0 ? (

                                    <p className="driver-empty-state">
                                        You do not have any trip history yet.
                                    </p>

                                ) : (

                                    history.map(trip => (

                                        <div
                                            className="driver-trip-card"
                                            key={getTripId(trip)}
                                        >

                                            <div className="driver-trip-heading">

                                                <h3>
                                                    Booking #{getTripId(trip)}
                                                </h3>

                                                <span
                                                    className={`driver-status ${String(getTripStatus(trip))
                                                        .toLowerCase()
                                                        .replace(/\s+/g, "-")}`}
                                                >
                                                    {getTripStatus(trip)}
                                                </span>

                                            </div>

                                            <div className="driver-trip-details">

                                                <p>
                                                    <strong>Pickup:</strong>{" "}
                                                    {trip.pickup_location || "Not provided"}
                                                </p>

                                                <p>
                                                    <strong>Destination:</strong>{" "}
                                                    {trip.dropoff_location || "Not provided"}
                                                </p>

                                                <p>
                                                    <strong>Date:</strong>{" "}
                                                    {formatDate(trip.pickup_datetime)}
                                                </p>

                                            </div>

                                        </div>

                                    ))

                                )}

                            </section>

                        )}

                        {/* Driver profile */}
                        {activeSection === "profile" && (
                            <DriverProfile />
                        )}

                    </>

                )}

            </main>

        </div>

    );
}

export default DriverDashboard;
