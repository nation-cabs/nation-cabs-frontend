
import { useState } from "react";

import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import DashboardCards from "../components/DashboardCards";
import BookingForm from "../components/BookingForm";
import UpcomingBooking from "../components/UpcomingBooking";
import BookingHistory from "../components/BookingHistory";
import UserProfile from "../components/UserProfile";

import "../styles/UserDashboard.css";

function UserDashboard() {
    const [bookingRefreshKey, setBookingRefreshKey] = useState(0);
    const [activeSection, setActiveSection] = useState("overview");

    const handleBookingCreated = () => {
        setBookingRefreshKey((previous) => previous + 1);
    };

    return (
        <div className="dashboard">
            <DashboardSidebar
                activeSection={activeSection}
                onNavigate={setActiveSection}
            />

            <div className="dashboard-content">
                <DashboardHeader />

                {/* Dashboard Overview */}
                {activeSection === "overview" && (
                    <>
                        <DashboardCards />

                        <div className="dashboard-grid">
                            <BookingForm
                                onBookingCreated={handleBookingCreated}
                            />

                            <UpcomingBooking
                                refreshKey={bookingRefreshKey}
                            />

                            <BookingHistory
                                refreshKey={bookingRefreshKey}
                            />
                        </div>
                    </>
                )}

                {/* Book a Ride */}
                {activeSection === "book" && (
                    <BookingForm
                        onBookingCreated={handleBookingCreated}
                    />
                )}

                {/* Upcoming Bookings */}
                {activeSection === "bookings" && (
                    <UpcomingBooking
                        refreshKey={bookingRefreshKey}
                    />
                )}

                {/* Booking History */}
                {activeSection === "history" && (
                    <BookingHistory
                        refreshKey={bookingRefreshKey}
                    />
                )}

                {/* User Profile */}
                {activeSection === "profile" && (
                    <UserProfile />
                )}
            </div>
        </div>
    );
}

export default UserDashboard;
