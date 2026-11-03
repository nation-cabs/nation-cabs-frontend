
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaHome,
    FaCalendarAlt,
    FaUsers,
    FaCar,
    FaSignOutAlt,
    FaSyncAlt
} from "react-icons/fa";

import axiosInstance from "../utils/axiosInstance";
import "../styles/AdminDashboard.css";
import "../styles/AdminDashboardResponsive.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("dashboard");
    const [bookings, setBookings] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [selectedDrivers, setSelectedDrivers] = useState({});
    const [loading, setLoading] = useState(true);
    const [assigningId, setAssigningId] = useState(null);
    const [confirmingId, setConfirmingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Fetch bookings and approved drivers from your backend
    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [bookingResponse, driverResponse] = await Promise.all([
                axiosInstance.get("/admin/bookings"),
                axiosInstance.get("/admin/drivers/approved")
            ]);

            const bookingList = bookingResponse.data?.bookings;
            const driverList = driverResponse.data?.drivers;

            setBookings(Array.isArray(bookingList) ? bookingList : []);
            setDrivers(Array.isArray(driverList) ? driverList : []);
        } catch (err) {
            console.error("Admin dashboard loading error:", err);

            setError(
                err.response?.data?.message ||
                "Could not load bookings and approved drivers. Please check the backend and your admin login."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const driverName = (driver) =>
        `${driver.first_name || ""} ${driver.last_name || ""}`.trim() ||
        driver.email ||
        "Unnamed driver";

        const customerFirstName = (booking) =>
            booking.customer_first_name ||
            booking.first_name ||
            booking.user_first_name ||
            booking.customer?.first_name ||
            booking.user?.first_name ||
            "N/A";

        const customerSurname = (booking) =>
            booking.customer_surname ||
            booking.customer_last_name ||
            booking.last_name ||
            booking.user_last_name ||
            booking.customer?.last_name ||
            booking.user?.last_name ||
            "N/A";

    const formatDate = (value) => {
        if (!value) return "Not scheduled";

        const date = new Date(value);

        return Number.isNaN(date.getTime())
            ? String(value)
            : date.toLocaleString();
    };

    const statusClass = (status) =>
        String(status || "pending")
            .toLowerCase()
            .replace(/\s+/g, "-");

    const handleDriverChange = (bookingId, driverId) => {
        setSelectedDrivers((previous) => ({
            ...previous,
            [bookingId]: driverId
        }));

        setError("");
        setSuccess("");
    };

    // Assign the selected approved driver to a booking
    const handleAssignDriver = async (booking) => {
        const bookingId = booking.id;
        const driverId =
            selectedDrivers[bookingId] ?? booking.driver_id ?? "";

        if (!driverId) {
            setError("Please select an approved driver first.");
            return;
        }

        if (String(driverId) === String(booking.driver_id)) {
            setSuccess("This driver is already assigned to this booking.");
            setError("");
            return;
        }

        const chosenDriver = drivers.find(
            (driver) => String(driver.id) === String(driverId)
        );

        if (!chosenDriver) {
            setError("The selected driver is not in the approved drivers list.");
            return;
        }

        const confirmed = window.confirm(
            `Assign ${driverName(chosenDriver)} to this booking?`
        );

        if (!confirmed) return;

        setAssigningId(bookingId);
        setError("");
        setSuccess("");

        try {
            const response = await axiosInstance.patch(
                `/admin/bookings/${encodeURIComponent(bookingId)}/assign-driver`,
                { driver_id: driverId }
            );

            const updatedBooking = response.data?.booking;

            setBookings((previous) =>
                previous.map((item) =>
                    String(item.id) === String(bookingId)
                        ? {
                              ...item,
                              ...(updatedBooking || {}),
                              driver_id: driverId,
                              booking_status:
                                  updatedBooking?.booking_status ||
                                  "Driver Assigned"
                          }
                        : item
                )
            );

            setSelectedDrivers((previous) => ({
                ...previous,
                [bookingId]: driverId
            }));

            setSuccess(
                `${driverName(chosenDriver)} was assigned successfully.`
            );
        } catch (err) {
            console.error("Driver assignment error:", err);

            setError(
                err.response?.data?.message ||
                "Driver assignment failed. Please try again."
            );
        } finally {
            setAssigningId(null);
        }
    };

    const handleConfirmRide = async (booking) => {
    const bookingId = booking.id;
    const status = String(
        booking.booking_status || "pending"
    ).trim().toLowerCase();

    if (status !== "pending") {
        setError("Only pending bookings can be confirmed.");
        return;
    }

    const confirmed = window.confirm(
        "Are you sure you want to confirm this booking?"
    );

    if (!confirmed) return;

    setConfirmingId(bookingId);
    setError("");
    setSuccess("");

    try {
        const response = await axiosInstance.patch(
            `/admin/bookings/${encodeURIComponent(bookingId)}/confirm`
        );

        const updatedBooking = response.data?.booking;

        setBookings((previous) =>
            previous.map((item) =>
                String(item.id) === String(bookingId)
                    ? {
                          ...item,
                          ...(updatedBooking || {}),
                          booking_status:
                              updatedBooking?.booking_status ||
                              "Confirmed",
                      }
                    : item
            )
        );

        setSuccess("Booking confirmed successfully.");
    } catch (err) {
        console.error("Booking confirmation error:", err);

        setError(
            err.response?.data?.message ||
            "Could not confirm this booking. Please try again."
        );
    } finally {
        setConfirmingId(null);
    }
};

    const handleLogout = () => {
        const confirmed = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmed) return;

        localStorage.removeItem("token");
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
    };

    const unassignedCount = bookings.filter(
        (booking) => !booking.driver_id
    ).length;

    const completedCount = bookings.filter(
        (booking) =>
            String(booking.booking_status || "").toLowerCase() === "completed"
    ).length;

    const renderBookingsTable = (items, showConfirmButton = false) => (
    <div className="admin-table-scroll">
        <table className="admin-bookings-table">

            <colgroup>
                <col style={{ width: "12%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "17%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "12%" }} />
            </colgroup>

            <thead>
                <tr>
                    <th>Customer Name</th>
                    <th>Customer Surname</th>
                    <th>Booking</th>
                    <th>Pickup Date & Time</th>
                    <th>Status</th>
                    <th>Approved Driver</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                {items.map((booking) => {

                    const currentSelection =
                        selectedDrivers[booking.id] ??
                        booking.driver_id ??
                        "";

                    const alreadyAssigned =
                        Boolean(booking.driver_id) &&
                        String(currentSelection) ===
                        String(booking.driver_id);

                    const currentDriverInList = drivers.some(
                        (driver) =>
                            String(driver.id) ===
                            String(booking.driver_id)
                    );

                    const isPendingBooking =
                        String(booking.booking_status || "pending")
                            .trim()
                            .toLowerCase() === "pending";

                    const isConfirmedBooking =
                        String(booking.booking_status || "")
                            .trim()
                            .toLowerCase() === "confirmed";


                    return (
                        <tr key={booking.id}>

                            {/* Customer Name */}
                            <td>
                                {customerFirstName(booking)}
                            </td>

                            {/* Customer Surname */}
                            <td>
                                {customerSurname(booking)}
                            </td>

                            {/* Pickup and Drop-off */}
                            <td>
                                <div className="admin-booking-route">
                                    <strong>
                                        {booking.pickup_location || "N/A"}
                                    </strong>

                                    <span className="route-arrow">↓</span>

                                    <span>
                                        {booking.dropoff_location || "N/A"}
                                    </span>

                                    <small>
                                        {booking.vehicle_type || "Not specified"}
                                    </small>
                                </div>
                            </td>

                            {/* Pickup Date */}
                            <td>
                                {formatDate(booking.pickup_datetime)}
                            </td>

                            {/* Booking Status */}
                            <td>
                                <span
                                    className={`admin-status-badge ${statusClass(
                                        booking.booking_status
                                    )}`}
                                >
                                    {booking.booking_status || "Pending"}
                                </span>
                            </td>

                            {/* Approved Driver */}
                            
                            <td>
                                
                                    <select
                                        className="admin-driver-dropdown"
                                        value={currentSelection}
                                        onChange={(event) =>
                                            handleDriverChange(
                                                booking.id,
                                                event.target.value
                                            )
                                        }
                                        disabled={assigningId === booking.id}
                                        aria-label="Select approved driver"
                                    >
                                        <option value="">
                                            Select approved driver
                                        </option>

                                        {booking.driver_id &&
                                            !currentDriverInList && (
                                                <option value={booking.driver_id}>
                                                    Current driver
                                                </option>
                                            )}

                                        {drivers.map((driver) => (
                                            <option
                                                key={driver.id}
                                                value={driver.id}
                                            >
                                                {driverName(driver)}
                                            </option>
                                        ))}
                                    </select>
                                
                            </td>
                            
                            {/* Actions */}
                            <td className="admin-booking-actions">

                                {showConfirmButton &&
                                    isPendingBooking && (
                                        <button
                                            type="button"
                                            className="admin-confirm-button"
                                            disabled={
                                                confirmingId === booking.id
                                            }
                                            onClick={() =>
                                                handleConfirmRide(booking)
                                            }
                                        >
                                            {confirmingId === booking.id
                                                ? "Confirming..."
                                                : "Confirm Booking"}
                                        </button>
                                    )}

                                <button
                                    type="button"
                                    className="admin-assign-button"
                                    disabled={
                                        !isConfirmedBooking ||
                                        !currentSelection ||
                                        alreadyAssigned ||
                                        assigningId === booking.id
                                       
                                    }
                                    onClick={() =>
                                        handleAssignDriver(booking)
                                    }
                                >
                                    {assigningId === booking.id
                                        ? "Assigning..."
                                        : alreadyAssigned
                                        ? "Assigned"
                                        : booking.driver_id
                                        ? "Reassign Driver"
                                        : "Assign Driver"}
                                </button>

                            </td>
                        </tr>
                    );
                })}

                {items.length === 0 && (
                    <tr>
                        <td colSpan="7" className="admin-empty-state">
                            No bookings found.
                        </td>
                    </tr>
                )}
            </tbody>

        </table>
    </div>
);

    return (
        <div className="admin-dashboard">
            <aside className="admin-sidebar">
                <h2 className="admin-brand">Nation Cabs</h2>

                <button
                    type="button"
                    className={activeTab === "dashboard" ? "active" : ""}
                    onClick={() => setActiveTab("dashboard")}
                >
                    <FaHome />
                    <span>Dashboard</span>
                </button>

                <button
                    type="button"
                    className={activeTab === "bookings" ? "active" : ""}
                    onClick={() => setActiveTab("bookings")}
                >
                    <FaCalendarAlt />
                    <span>Manage Bookings</span>
                </button>

                <button
                    type="button"
                    className={activeTab === "drivers" ? "active" : ""}
                    onClick={() => setActiveTab("drivers")}
                >
                    <FaUsers />
                    <span>Approved Drivers</span>
                </button>

                <button
                    type="button"
                    className="admin-logout-button"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </aside>

            <main className="admin-main">
                <header className="admin-page-header">
                    <div>

                        <h1>
                            {activeTab === "dashboard"
                                ? "Admin Dashboard"
                                : activeTab === "bookings"
                                ? "Manage Bookings"
                                : "Approved Drivers"}
                        </h1>

                        <p className="admin-page-subtitle">
                            Manage rides and assign approved drivers.
                        </p>
                    </div>

                    
                </header>

                {error && (
                    <div className="admin-notice admin-notice-error" role="alert">
                        <span>{error}</span>
                        <button
                            type="button"
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                        >
                            ×
                        </button>
                    </div>
                )}

                {success && (
                    <div className="admin-notice admin-notice-success" role="status">
                        <span>{success}</span>
                        <button
                            type="button"
                            onClick={() => setSuccess("")}
                            aria-label="Dismiss success"
                        >
                            ×
                        </button>
                    </div>
                )}

                {loading ? (
                    <section className="admin-panel admin-loading">
                        Loading dashboard data...
                    </section>
                ) : (
                    <>
                        {activeTab === "dashboard" && (
                            <>
                                <section className="admin-stat-grid">
                                    <article className="admin-stat-card total-bookings-card ">
                                        <div className="admin-stat-icon purple">
                                            <FaCalendarAlt />
                                        </div>
                                        <p>Total Bookings</p>
                                        <h2>{bookings.length}</h2>
                                        <span className="admin-stat-accent"></span>
                                    </article>

                                    <article className="admin-stat-card approved-drivers-card">
                                        <div className="admin-stat-icon green">
                                            <FaUsers />
                                        </div>
                                        <p>Approved Drivers</p>
                                        <h2>{drivers.length}</h2>
                                        <span className="admin-stat-accent"></span>
                                    </article>

                                    <article className="admin-stat-card unassigned-rides-card">
                                        <div className="admin-stat-icon orange">
                                            <FaCar />
                                        </div>
                                        <p>Unassigned Rides</p>
                                        <h2>{unassignedCount}</h2>
                                        <span className="admin-stat-accent"></span>
                                    </article>

                                    <article className="admin-stat-card completed-rides-card    ">
                                        <div className="admin-stat-icon blue">
                                            <FaHome />
                                        </div>
                                        <p>Completed Rides</p>
                                        <h2>{completedCount}</h2>
                                        <span className="admin-stat-accent"></span>
                                    </article>
                                </section>

                                <section className="admin-panel">
                                    <div className="admin-panel-heading">
                                        <div>
                                            <h2>Recent Bookings</h2>
                                            <p>
                                                Review ride requests and driver assignments.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="admin-secondary-button"
                                            onClick={() => setActiveTab("bookings")}
                                        >
                                            View All Bookings
                                        </button>
                                    </div>

                                    {renderBookingsTable(bookings.slice(0, 5))}
                                </section>
                            </>
                        )}

                        {activeTab === "bookings" && (
                            <section className="admin-panel">
                                <div className="admin-panel-heading">
                                    <div>
                                        <h2>All Ride Bookings</h2>
                                        <p>
                                            Choose an approved driver from the dropdown
                                            and assign them to a booking.
                                        </p>
                                    </div>

                                    <span className="admin-count">
                                        {bookings.length} bookings
                                    </span>
                                </div>

                                {drivers.length === 0 && (
                                    <div className="admin-notice admin-notice-warning">
                                        No approved drivers are available. Approve a
                                        driver application before assigning rides.
                                    </div>
                                )}

                                {renderBookingsTable(bookings, true)}
                            </section>
                        )}

                        {activeTab === "drivers" && (
                            <section className="admin-panel">
                                <div className="admin-panel-heading">
                                    <div>
                                        <h2>Approved Drivers</h2>
                                        <p>
                                            Drivers available for ride assignments.
                                        </p>
                                    </div>

                                    <span className="admin-count">
                                        {drivers.length} drivers
                                    </span>
                                </div>

                                <div className="admin-driver-grid">
                                    {drivers.map((driver) => (
                                        <article
                                            className="admin-driver-card"
                                            key={driver.id}
                                        >
                                            <div className="admin-driver-avatar">
                                                <FaCar />
                                            </div>

                                            <div className="admin-driver-info">
                                                <h3>{driverName(driver)}</h3>
                                                <p>{driver.email || "No email listed"}</p>
                                                <p>{driver.phone || "No phone listed"}</p>

                                                <span className="admin-status-badge approved">
                                                    Approved
                                                </span>
                                            </div>
                                        </article>
                                    ))}

                                    {drivers.length === 0 && (
                                        <p className="admin-empty-state">
                                            No approved drivers found.
                                        </p>
                                    )}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;
