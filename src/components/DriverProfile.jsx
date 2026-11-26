
import { useEffect, useState } from "react";
import "../styles/DriverProfile.css";

function DriverProfile() {
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_URL =
        import.meta.env.VITE_API || "http://localhost:5000/api";

    useEffect(() => {
        const fetchDriverProfile = async () => {
            try {
                const token = localStorage.getItem("userToken");

                const response = await fetch(`${API_URL}/driver/profile`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load driver profile."
                    );
                }

                setDriver(data.driver);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDriverProfile();
    }, []);

    if (loading) {
        return <div className="driver-profile">Loading driver profile...</div>;
    }

    if (error) {
        return <div className="driver-profile error-message">{error}</div>;
    }

    if (!driver) {
        return <div className="driver-profile">No driver profile found.</div>;
    }

    return (
        <div className="driver-profile">
            <div className="profile-heading">
                <h2>My Driver Profile</h2>
                <p>View your personal and driver information.</p>
            </div>

            <div className="driver-profile-card">

                <div className="driver-profile-header">
                    <div className="driver-avatar">
                        {driver.first_name?.charAt(0)}
                        {driver.last_name?.charAt(0)}
                    </div>

                    <div>
                        <h3>
                            {driver.first_name} {driver.last_name}
                        </h3>
                        <span className="driver-status">
                            {driver.application_status}
                        </span>
                    </div>
                </div>

                <div className="driver-profile-section">
                    <h3>Personal Information</h3>

                    <div className="profile-details">
                        <div>
                            <label>Driver ID</label>
                            <p>{driver.application_id || "N/A"}</p>
                        </div>

                        <div>
                            <label>First Name</label>
                            <p>{driver.first_name || "N/A"}</p>
                        </div>

                        <div>
                            <label>Last Name</label>
                            <p>{driver.last_name || "N/A"}</p>
                        </div>

                        <div>
                            <label>Email Address</label>
                            <p>{driver.email || "N/A"}</p>
                        </div>

                        <div>
                            <label>Phone Number</label>
                            <p>{driver.phone || "N/A"}</p>
                        </div>

                        <div>
                            <label>Province</label>
                            <p>{driver.province || "N/A"}</p>
                        </div>

                        <div>
                            <label>City</label>
                            <p>{driver.city || "N/A"}</p>
                        </div>
                    </div>
                </div>

                <div className="driver-profile-section">
                    <h3>Licence Information</h3>

                    <div className="profile-details">
                        <div>
                            <label>Licence Number</label>
                            <p>{driver.license_number || "N/A"}</p>
                        </div>

                        <div>
                            <label>Licence Expiry</label>
                            <p>
                                {driver.license_expiry
                                    ? String(driver.license_expiry).slice(0, 10)
                                    : "N/A"}
                            </p>
                        </div>

                        <div>
                            <label>PDP Number</label>
                            <p>{driver.pdp_number || "N/A"}</p>
                        </div>

                        <div>
                            <label>PDP Expiry</label>
                            <p>
                                {driver.pdp_expiry
                                    ? String(driver.pdp_expiry).slice(0, 10)
                                    : "N/A"}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default DriverProfile;
