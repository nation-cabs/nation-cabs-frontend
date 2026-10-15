import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/HRDashboard.css";
import DriverApplicationCard from "../components/DriverApplicationCard";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";

const API = import.meta.env.VITE_API;

const HRDashboard = () => {
const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] =
        useState("dashboard");
       const [approvedApplications, setApprovedApplications] = useState([]);

const [rejectedApplications, setRejectedApplications] = useState([]);

const [approvedLoading, setApprovedLoading] = useState(false);

const [rejectedLoading, setRejectedLoading] = useState(false);



const fetchApplications = async () => {
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
    };


    useEffect(() => {
        fetchApplications();

    }, []);

const fetchRejectedApplications = async () => {

    try {

        setRejectedLoading(true);

        const token =
            localStorage.getItem("token");

        const response = await axios.get(
            `${API}/hr/driver-applications/rejected`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        console.log(
            "REJECTED APPLICATIONS:",
            response.data
        );

        setRejectedApplications(
            response.data.applications || []
        );

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


};

const fetchApprovedApplications = async () => {

    try {

        setApprovedLoading(true);

        const token =
            localStorage.getItem("token");

        const response = await axios.get(
            `${API}/hr/driver-applications/approved`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        console.log(
            "APPROVED APPLICATIONS:",
            response.data
        );

        setApprovedApplications(
            response.data.applications || []
        );

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



};

    const reviewApplication = (id) => {
        navigate(
            `/hr-dashboard/applications/${id}`
        );
    };


    if (loading) {
        return <p>Loading applications...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


    return (
        <div className="hr-dashboard">

            <aside className="hr-sidebar">

                <h2>Nation Cabs</h2>

                <nav>

                    <button
                        className={
                            activeSection === "dashboard"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveSection("dashboard")
                        }
                    >
                        Dashboard
                    </button>

                    <button
                        className={
                            activeSection === "applications"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveSection("applications")
                        }
                    >
                        New Applications
                    </button>

                  <button 
    className={
        activeSection === "approved"
            ? "active"
            : ""
    }
    onClick={() => {
        setActiveSection("approved");
        fetchApprovedApplications();
    }}
>
    Approved Drivers
</button>

                  <button
    className={
        activeSection === "rejected"
            ? "active"
            : ""
    }
    onClick={() => {
        setActiveSection("rejected");
        fetchRejectedApplications();
    }}
>
    Rejected Applications
</button>

<Logout />
                </nav>

            </aside>


            <main className="hr-main">

                {activeSection === "dashboard" && (
                    <>
                        <h1>HR Dashboard</h1>

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
        <p>0</p>
    </div>

    <div className="stat-card rejected">
        <h3>Rejected Applications</h3>
        <p>0</p>
    </div>


                        </div>
                    </>
                )}


                {activeSection === "applications" && (
                    <section className="applications-section">

                        <h1>New Applications</h1>

                        {applications.length === 0 ? (

                            <p>
                                No pending applications.
                            </p>

                        ) : (

                            applications.map(
                                (application) => (

                                    <DriverApplicationCard
                                        key={application.id}
                                        application={
                                            application
                                        }
                                        reviewApplication={
                                            reviewApplication
                                        }
                                    />

                                )
                            )

                        )}

                    </section>
                )}


               {activeSection === "approved" && (
    <section className="applications-section">

        <h1>Approved Drivers</h1>

        {approvedLoading ? (

            <p>
                Loading approved applications...
            </p>

        ) : approvedApplications.length === 0 ? (

            <p>
                No approved applications.
            </p>

        ) : (

            approvedApplications.map(
                (application) => (

                    <DriverApplicationCard
                        key={application.id}
                        application={application}
                        reviewApplication={
                            reviewApplication
                        }
                    />

                )
            )

        )}

    </section>
)}


               {activeSection === "rejected" && (
    <section className="applications-section">

        <h1>Rejected Applications</h1>

        {rejectedLoading ? (

            <p>
                Loading rejected applications...
            </p>

        ) : rejectedApplications.length === 0 ? (

            <p>
                No rejected applications.
            </p>

        ) : (

            rejectedApplications.map(
                (application) => (

                    <DriverApplicationCard
                        key={application.id}
                        application={application}
                        reviewApplication={
                            reviewApplication
                        }
                    />

                )
            )

        )}

    </section>
)}

            </main>

        </div>
    );
=======
>>>>>>> c8b37308a68237d97f3e1471fc0cbe56d02d8c53
};

useEffect(() => {
    fetchApplications();
}, []);

const reviewApplication = (id) => {
    navigate(`/hr-dashboard/applications/${id}`);
};

if (loading) {
    return <p>Loading applications...</p>;
}

if (error) {
    return (
        <div className="hr-error">
            <p>{error}</p>
            <button onClick={fetchApplications}>
                Try Again
            </button>
        </div>
    );
}

return (
    <div className="hr-dashboard">
        <aside className="hr-sidebar">
            <h2>Nation Cabs</h2>

            <nav>
                <button
                    className={
                        activeSection === "dashboard" ? "active" : ""
                    }
                    onClick={() => setActiveSection("dashboard")}
                >
                    Dashboard
                </button>

                <button
                    className={
                        activeSection === "applications" ? "active" : ""
                    }
                    onClick={() => setActiveSection("applications")}
                >
                    New Applications
                </button>

                <button
                    className={
                        activeSection === "approved" ? "active" : ""
                    }
                    onClick={() => setActiveSection("approved")}
                >
                    Approved Drivers
                </button>

                <button
                    className={
                        activeSection === "rejected" ? "active" : ""
                    }
                    onClick={() => setActiveSection("rejected")}
                >
                    Rejected Applications
                </button>
            </nav>
        </aside>

        <main className="hr-main">
            {activeSection === "dashboard" && (
                <>
                    <h1>HR Dashboard</h1>

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
                            <p>0</p>
                        </div>

                        <div className="stat-card rejected">
                            <h3>Rejected Applications</h3>
                            <p>0</p>
                        </div>
                    </div>
                </>
            )}

            {activeSection === "applications" && (
                <section className="applications-section">
                    <h1>New Applications</h1>

                    {applications.length === 0 ? (
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
                <section>
                    <h1>Approved Drivers</h1>
                    <p>
                        Approved driver applications will appear here.
                    </p>
                </section>
            )}

            {activeSection === "rejected" && (
                <section>
                    <h1>Rejected Applications</h1>
                    <p>
                        Rejected driver applications will appear here.
                    </p>
                </section>
            )}
        </main>
    </div>
);


};

export default HRDashboard;
