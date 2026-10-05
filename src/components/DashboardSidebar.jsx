import {
    FaHome,
    FaCalendarAlt,
    FaHistory,
    FaUser,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

import "../styles/DashboardSidebar.css";

function DashboardSidebar(){

    return(

        <aside className="sidebar">

            <h2>Nation Cabs</h2>

            <ul>

                <li><FaHome /> Dashboard</li>

                <li><FaCalendarAlt /> Book Ride</li>

                <li><FaHistory /> My Bookings</li>

                <li><FaUser /> Profile</li>

                <li><FaCog /> Settings</li>

                <li><FaSignOutAlt /> Logout</li>

            </ul>

        </aside>

    )

}

export default DashboardSidebar;