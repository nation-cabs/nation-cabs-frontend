
import { useNavigate } from "react-router-dom";
import {
    FaHome,
    FaCalendarAlt,
    FaHistory,
    FaUser,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

import "../styles/DashboardSidebar.css";

function DashboardSidebar({
    activeSection = "overview",
    onNavigate = () => {}
}) {
    const navigate = useNavigate();

    const menuItems = [
        { label: "Dashboard", section: "overview", icon: FaHome },
        { label: "Book Ride", section: "book", icon: FaCalendarAlt },
        { label: "Upcoming Bookings", section: "bookings", icon: FaCalendarAlt },
        { label: "Booking History", section: "history", icon: FaHistory },
        { label: "Profile", section: "profile", icon: FaUser },
        { label: "Settings", section: "settings", icon: FaCog }
    ];

<<<<<<< HEAD
    const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("token");
};

=======
>>>>>>> 3e34dd9 (Update dashboard, booking and authentication)
    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to logout?");

        if (confirmed) {
            localStorage.removeItem("userToken");
            navigate("/login", { replace: true });
        }
    };

    const handleNavigation = (section) => {
        console.log("Selected section:", section);
        onNavigate(section);
    };

    return (
        <aside className="sidebar">
            <h2>Nation Cabs</h2>

            <ul>
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <li
                            key={item.section}
                            className={
                                activeSection === item.section ? "active" : ""
                            }
                        >
                            <button
                                type="button"
                                className="sidebar-link"
                                onClick={() => handleNavigation(item.section)}
                                aria-current={
                                    activeSection === item.section
                                        ? "page"
                                        : undefined
                                }
                            >
                                <Icon />
                                <span>{item.label}</span>
                            </button>
                        </li>
                    );
                })}

                <li>
                    <button
                        type="button"
                        className="sidebar-link"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </li>
            </ul>
        </aside>
    );
}

export default DashboardSidebar;
