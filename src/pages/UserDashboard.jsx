import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import DashboardCards from "../components/DashboardCards";
import BookingForm from "../components/BookingForm";
import UpcomingBooking from "../components/UpcomingBooking";
import BookingHistory from "../components/BookingHistory";


import "../styles/UserDashboard.css";

function UserDashboard() {

    return (

        <div className="dashboard">

            <DashboardSidebar />

            <div className="dashboard-content">

                <DashboardHeader />

                <DashboardCards />

                <div className="dashboard-grid">

                    <BookingForm />

                    <UpcomingBooking />

                </div>

                <BookingHistory />

            </div>

        </div>

    );

}

export default UserDashboard;