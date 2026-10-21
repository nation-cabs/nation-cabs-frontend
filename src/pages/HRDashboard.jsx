

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/HRDashboard.css";
import DriverApplicationCard from "../components/DriverApplicationCard";

const API = import.meta.env.VITE_API || "http://localhost:5000/api";

const HRDashboard = () => {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [approvedApplications, setApprovedApplications] = useState([]);
    const [rejectedApplications, setRejectedApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [approvedLoading, setApprovedLoading] = useState(false);
    const [rejectedLoading, setRejectedLoading] = useState(false);

    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("dashboard");

    // Logout with confirmation
    const handleLogout = () => {
        const confirmLogout = window.confirm(
            "Are you sure you want to logout?"
        );

        if (confirmLogout) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    // Fetch pending applications
    const fetchApplications = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API}/hr/driver-applications/pending`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setApplications(response.data.applications || []);
        } catch (err) {
            console.error("ERROR FETCHING APPLICATIONS:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load driver applications."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch approved applications
    const fetchApprovedApplications = useCallback(async () => {
        try {
            setApprovedLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API}/hr/driver-applications/approved`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setApprovedApplications(response.data.applications || []);
        } catch (err) {
            console.error(
                "ERROR FETCHING APPROVED APPLICATIONS:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load approved applications."
            );
        } finally {
            setApprovedLoading(false);
        }
    }, []);

    // Fetch rejected applications
    const fetchRejectedApplications = useCallback(async () => {
        try {
            setRejectedLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API}/hr/driver-applications/rejected`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setRejectedApplications(response.data.applications || []);
        } catch (err) {
            console.error(
                "ERROR FETCHING REJECTED APPLICATIONS:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load rejected applications."
            );
        } finally {
            setRejectedLoading(false);
        }
    }, []);

    // Load dashboard data when the page opens
    useEffect(() => {
        fetchApplications();
        fetchApprovedApplications();
        fetchRejectedApplications();
    }, [
        fetchApplications,
        fetchApprovedApplications,
        fetchRejectedApplications,
    ]);

    // Navigate to application review
    const reviewApplication = (id) => {
        navigate(`/hr-dashboard/applications/${id}`);
    };

    // Change dashboard section
    const openSection = (section) => {
        setError("");
        setActiveSection(section);

        if (section === "applications") {
            fetchApplications();
        } else if (section === "approved") {
            fetchApprovedApplications();
        } else if (section === "rejected") {
            fetchRejectedApplications();
        }
    };

    return (
        <div className="hr-dashboard">
            <aside className="hr-sidebar">
                <h2>Nation Cabs</h2>

                <nav>
                    <button
                        type="button"
                        className={
                            activeSection === "dashboard" ? "active" : ""
                        }
                        onClick={() => openSection("dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        type="button"
                        className={
                            activeSection === "applications" ? "active" : ""
                        }
                        onClick={() => openSection("applications")}
                    >
                        New Applications
                    </button>

                    <button
                        type="button"
                        className={
                            activeSection === "approved" ? "active" : ""
                        }
                        onClick={() => openSection("approved")}
                    >
                        Approved Drivers
                    </button>

                    <button
                        type="button"
                        className={
                            activeSection === "rejected" ? "active" : ""
                        }
                        onClick={() => openSection("rejected")}
                    >
                        Rejected Applications
                    </button>

                    <button
                        type="button"
                        className="hr-logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </nav>
            </aside>

            <main className="hr-main">
                {error && (
                    <div className="hr-error" role="alert">
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={() => openSection(activeSection)}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {activeSection === "dashboard" && (
                    <>
                        <h1>HR Dashboard</h1>

                        {loading ? (
                            <p>Loading applications...</p>
                        ) : (
                            <div className="dashboard-stats">
                                <div className="stat-card new">
                                    <h3>New Applications</h3>
                                    <p>{applications.length}</p>
                                </div>

                                <div className="stat-card pending">
                                    <h3>Pending Review</h3>
                                    <p>{applications.length}</p>
                                </div>

                                <div className="stat-card approved">
                                    <h3>Approved Drivers</h3>
                                    <p>{approvedApplications.length}</p>
                                </div>

                                <div className="stat-card rejected">
                                    <h3>Rejected Applications</h3>
                                    <p>{rejectedApplications.length}</p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeSection === "applications" && (
                    <section className="applications-section">
                        <h1>New Applications</h1>

                        {loading ? (
                            <p>Loading applications...</p>
                        ) : applications.length === 0 ? (
                            <p>No pending applications.</p>
                        ) : (
                            applications.map((application) => (
                                <DriverApplicationCard
                                    key={application.id}
                                    application={application}
                                    reviewApplication={reviewApplication}
                                />
                            ))
                        )}
                    </section>
                )}

                {activeSection === "approved" && (
                    <section className="applications-section">
                        <h1>Approved Drivers</h1>

                        {approvedLoading ? (
                            <p>Loading approved applications...</p>
                        ) : approvedApplications.length === 0 ? (
                            <p>No approved applications.</p>
                        ) : (
                            approvedApplications.map((application) => (
                                <DriverApplicationCard
                                    key={application.id}
                                    application={application}
                                    reviewApplication={reviewApplication}
                                />
                            ))
                        )}
                    </section>
                )}

                {activeSection === "rejected" && (
                    <section className="applications-section">
                        <h1>Rejected Applications</h1>

                        {rejectedLoading ? (
                            <p>Loading rejected applications...</p>
                        ) : rejectedApplications.length === 0 ? (
                            <p>No rejected applications.</p>
                        ) : (
                            rejectedApplications.map((application) => (
                                <DriverApplicationCard
                                    key={application.id}
                                    application={application}
                                    reviewApplication={reviewApplication}
                                />
                            ))
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default HRDashboard;
