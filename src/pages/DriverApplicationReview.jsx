import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "../styles/DriverApplicationReview.css"

const API = import.meta.env.VITE_API;

const DriverApplicationReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
   
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Driver account state
    
    const [accountCreated, setAccountCreated] = useState(false);
    const [createdUser, setCreatedUser] = useState(null);
    const [temporaryPassword, setTemporaryPassword] = useState("");

    useEffect(() => {
        fetchApplication();
    }, [id]);

    const fetchApplication = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${API}/hr/driver-applications/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "DRIVER APPLICATION RESPONSE:",
                response.data
            );

            setApplication(response.data.application);

        } catch (err) {
            console.error(
                "ERROR FETCHING DRIVER APPLICATION:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load application."
            );

        } finally {
            setLoading(false);
        }
    };

const viewDocument = async (documentType) => {

    try {

        const token =
            localStorage.getItem("token");

        const response = await axios.get(
            `${API}/hr/driver-applications/${id}/document/${documentType}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: "blob"
            }
        );


        // Create temporary browser URL
        const fileUrl =
            URL.createObjectURL(response.data);


        // Open document
        window.open(
            fileUrl,
            "_blank"
        );


        // Clean up after a short delay
        setTimeout(() => {
            URL.revokeObjectURL(fileUrl);
        }, 60000);

    } catch (error) {

        console.error(
            "VIEW DOCUMENT ERROR:",
            error
        );

        alert(
            error.response?.data?.message ||
            "Failed to open document."
        );

    }

};
    // ==========================================
    // APPROVE APPLICATION
    // ==========================================

   const approveApplication = async () => {

    const confirmed = window.confirm(
        "Are you sure you want to approve this application and create the driver's account?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const token =
            localStorage.getItem("token");

        const response = await axios.patch(
            `${API}/hr/driver-applications/${id}/approve`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log(
            "APPROVE RESPONSE:",
            response.data
        );

        // Save created driver information
        setCreatedUser(
            response.data.user
        );

        setTemporaryPassword(
            response.data.temporaryPassword || ""
        );

        setAccountCreated(true);

        // Reload application
        await fetchApplication();

        alert(
            response.data.message
        );

    } catch (err) {

        console.error(
            "APPROVE APPLICATION ERROR:",
            err
        );

        console.error(
            "SERVER RESPONSE:",
            err.response?.data
        );

        alert(
            err.response?.data?.message ||
            "Failed to approve application."
        );
    }
};



    // ==========================================
    // APPLICATION NOT FOUND
    // ==========================================

    if (!application) {
        return (
            <div className="review-page">
                <p>
                    Application not found.
                </p>
            </div>
        );
    }


    return (
        <div className="review-page">

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="review-header">

                <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Back to Applications
                </button>

                <div>

                    <h1>
                        Driver Application Review
                    </h1>

                    <p>
                        Review the applicant's information
                        and documents before making a decision.
                    </p>

                </div>

            </div>


            {/* ================================= */}
            {/* APPLICATION STATUS */}
            {/* ================================= */}

            <div className="application-status">

                <strong>
                    Status:
                </strong>

                <span
                    className={`status-badge ${application.application_status}`}
                >
                    {application.application_status}
                </span>

            </div>


            {/* ================================= */}
            {/* PERSONAL INFORMATION */}
            {/* ================================= */}

            <section className="review-section">

                <h2>
                    Personal Information
                </h2>

                <div className="details-grid">

                    <div className="detail-item">
                        <label>
                            First Name
                        </label>

                        <p>
                            {application.first_name}
                        </p>
                    </div>

                    <div className="detail-item">
                        <label>
                            Last Name
                        </label>

                        <p>
                            {application.last_name}
                        </p>
                    </div>

                    <div className="detail-item">
                        <label>
                            Email
                        </label>

                        <p>
                            {application.email}
                        </p>
                    </div>

                    <div className="detail-item">
                        <label>
                            Phone
                        </label>

                        <p>
                            {application.phone}
                        </p>
                    </div>

                    <div className="detail-item">
                        <label>
                            Date of Birth
                        </label>

                        <p>
                            {application.date_of_birth}
                        </p>
                    </div>

                    <div className="detail-item">
                        <label>
                            Gender
                        </label>

                        <p>
                            {application.gender}
                        </p>
                    </div>

                </div>

            </section>


            {/* ================================= */}
            {/* ADDRESS */}
            {/* ================================= */}

            <section className="review-section">

                <h2>
                    Address Information
                </h2>

                <div className="details-grid">

                    <div className="detail-item">

                        <label>
                            Province
                        </label>

                        <p>
                            {application.province}
                        </p>

                    </div>

                    <div className="detail-item">

                        <label>
                            City
                        </label>

                        <p>
                            {application.city}
                        </p>

                    </div>

                    <div className="detail-item full-width">

                        <label>
                            Residential Address
                        </label>

                        <p>
                            {application.address}
                        </p>

                    </div>

                </div>

            </section>


            {/* ================================= */}
            {/* DRIVER INFORMATION */}
            {/* ================================= */}

            <section className="review-section">

                <h2>
                    Driver Information
                </h2>

                <div className="details-grid">

                    <div className="detail-item">

                        <label>
                            License Number
                        </label>

                        <p>
                            {application.license_number}
                        </p>

                    </div>

                    <div className="detail-item">

                        <label>
                            License Expiry
                        </label>

                        <p>
                            {application.license_expiry}
                        </p>

                    </div>

                    <div className="detail-item">

                        <label>
                            PDP Number
                        </label>

                        <p>
                            {application.pdp_number}
                        </p>

                    </div>

                    <div className="detail-item">

                        <label>
                            PDP Expiry
                        </label>

                        <p>
                            {application.pdp_expiry}
                        </p>

                    </div>

                    <div className="detail-item">

                        <label>
                            Driving Experience
                        </label>

                        <p>
                            {application.driving_experience} years
                        </p>

                    </div>

                </div>

            </section>


            {/* ================================= */}
            {/* EMERGENCY CONTACT */}
            {/* ================================= */}

            <section className="review-section">

                <h2>
                    Emergency Contact
                </h2>

                <div className="details-grid">

                    <div className="detail-item">

                        <label>
                            Name
                        </label>

                        <p>
                            {application.emergency_name}
                        </p>

                    </div>

                    <div className="detail-item">

                        <label>
                            Relationship
                        </label>

                        <p>
                            {application.emergency_relationship}
                        </p>

                    </div>

                    <div className="detail-item">

                        <label>
                            Phone
                        </label>

                        <p>
                            {application.emergency_phone}
                        </p>

                    </div>

                </div>

            </section>


            {/* ================================= */}
            {/* DOCUMENTS */}
            {/* ================================= */}

            <section className="review-section">

                <h2>
                    Documents
                </h2>

                <div className="documents-grid">

                    {/* ID */}

                    <div className="document-card">

                        <h3>
                            South African ID
                        </h3>

                       {application.id_document ? (

    <button
        onClick={() =>
            viewDocument("id")
        }
    >
        View ID Document
    </button>

) : (

    <p>
        No document uploaded.
    </p>

)}
                    </div>


                    {/* LICENSE */}

                    <div className="document-card">

                        <h3>
                            Driver's License
                        </h3>

                       {application.license_document ? (

    <button
        onClick={() =>
            viewDocument("license")
        }
    >
        View License
    </button>

) : (

    <p>
        No document uploaded.
    </p>

)}

                    </div>


                    {/* PDP */}

                    <div className="document-card">

                        <h3>
                            PDP Document
                        </h3>

                       {application.pdp_document ? (

    <button
        onClick={() =>
            viewDocument("pdp")
        }
    >
        View PDP
    </button>

) : (

    <p>
        No document uploaded.
    </p>

)}
                    </div>


                    {/* PROOF OF ADDRESS */}

                    <div className="document-card">

                        <h3>
                            Proof of Address
                        </h3>

                      {application.proof_of_address ? (

    <button
        onClick={() =>
            viewDocument("proof-of-address")
        }
    >
        View Proof of Address
    </button>

) : (

    <p>
        No document uploaded.
    </p>

)}

                    </div>


                    {/* PROFILE PHOTO */}

                    <div className="document-card">

                        <h3>
                            Profile Photo
                        </h3>

                       {application.profile_photo ? (

    <div>

        <button
            onClick={() =>
                viewDocument("profile-photo")
            }
        >
            View Profile Photo
        </button>

    </div>

) : (

    <p>
        No photo uploaded.
    </p>

)}
                    </div>

                </div>

            </section>


            {/* ================================= */}
            {/* HR NOTES */}
            {/* ================================= */}

            {application.admin_notes && (

                <section className="review-section">

                    <h2>
                        HR Notes
                    </h2>

                    <p>
                        {application.admin_notes}
                    </p>

                </section>

            )}


            {/* ================================= */}
            {/* ACTIONS */}
            {/* ================================= */}

            <section className="review-actions-section">


                {/* ================================= */}
                {/* PENDING APPLICATION */}
                {/* ================================= */}

                {application.application_status === "pending" && (

                    <div className="review-actions">

                        <button
                            className="reject-button"
                            onClick={() => {
                                alert(
                                    "Reject functionality will be added next."
                                );
                            }}
                        >
                            Reject Application
                        </button>

                        <button
                            className="approve-button"
                            onClick={approveApplication}
                        >
                            Approve Application
                        </button>

                    </div>

                )}


                {/* ================================= */}
                {/* APPROVED - CREATE ACCOUNT */}
                {/* ================================= */}

                {application.application_status === "approved" &&
                    !application.user_id && (
                    
                    <div className="create-account-container">

                        <h2>
                            Driver Account
                        </h2>

                        <p>
                            This application has been approved.
                            You can now create the driver's login account.
                        </p>

                        <button
                            className="create-account-button"
                            onClick={createDriverAccount}
                            disabled={creatingAccount}
                        >
                            {creatingAccount
                                ? "Creating Account..."
                                : "Create Driver Account"}
                        </button>

                    </div>

                )}


                {/* ================================= */}
                {/* ACCOUNT CREATED */}
                {/* ================================= */}

                {application.application_status === "approved" &&
                    (application.user_id || accountCreated) && (

                    <div className="account-created-container">

                        <h2>
                            Driver Account Created
                        </h2>

                        <p>
                            The driver account has been created successfully.
                        </p>


                        {/* Created user */}

                        {createdUser && (

                            <div className="driver-account-details">

                                <p>
                                    <strong>
                                        Name:
                                    </strong>{" "}

                                    {createdUser.first_name}{" "}
                                    {createdUser.last_name}
                                </p>

                                <p>
                                    <strong>
                                        Email:
                                    </strong>{" "}

                                    {createdUser.email}
                                </p>

                                <p>
                                    <strong>
                                        Role:
                                    </strong>{" "}

                                    {createdUser.role}
                                </p>

                            </div>

                        )}


                        {/* Temporary password */}

                        {temporaryPassword && (

                            <div className="temporary-password">

                                <p>
                                    <strong>
                                        Temporary Password:
                                    </strong>
                                </p>

                                <code>
                                    {temporaryPassword}
                                </code>

                                <p>
                                    Give this temporary password
                                    to the driver for their first login.
                                </p>

                            </div>

                        )}

                    </div>

                )}

            </section>

        </div>
    );
};

export default DriverApplicationReview;