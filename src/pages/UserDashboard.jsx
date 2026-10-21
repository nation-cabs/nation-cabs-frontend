
import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import DashboardCards from "../components/DashboardCards";
import BookingForm from "../components/BookingForm";
import UpcomingBooking from "../components/UpcomingBooking";
import BookingHistory from "../components/BookingHistory";

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

 {activeSection === "book" && (
                <BookingForm
                                onBookingCreated={handleBookingCreated}
                            />    
                   
                )}

                  


                {activeSection === "bookings" && (
                    
                    <UpcomingBooking
                        refreshKey={bookingRefreshKey}
                    />
                )}

                {activeSection === "history" && (
                    <BookingHistory
                        refreshKey={bookingRefreshKey}
                    />
                )}
            </div>
        </div>
    );
}

export default UserDashboard;
