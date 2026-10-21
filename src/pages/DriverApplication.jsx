

import { useState } from "react";
import "../styles/DriverApplication.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DriverApplication() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        province: "",
        city: "",
        address: "",
        licenseNumber: "",
        licenseExpiry: "",
        pdpNumber: "",
        pdpExpiry: "",
        drivingExperience: "",
        emergencyName: "",
        emergencyRelationship: "",
        emergencyPhone: "",
        idDocument: null,
        licenseDocument: null,
        pdpDocument: null,
        proofOfAddress: null,
        driverProfile: null,
        cv: null,
        agreeInformation: false,
        agreeBackground: false,
        agreeTerms: false,
    });

    const [submitting, setSubmitting] = useState(false);

    // Handle form changes and file uploads
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "file") {
            const file = files?.[0];

            if (!file) return;

            const documentFields = [
                "idDocument",
                "licenseDocument",
                "pdpDocument",
                "proofOfAddress",
                "driverProfile",
                "cv",
            ];

            if (documentFields.includes(name)) {
                const isPDF =
                    file.type === "application/pdf" &&
                    file.name.toLowerCase().endsWith(".pdf");

                if (!isPDF) {
                    alert("Only PDF files are allowed.");
                    e.target.value = "";
                    return;
                }

                const maxSize = 20 * 1024 * 1024;

                if (file.size > maxSize) {
                    alert("PDF files must not exceed 20 MB.");
                    e.target.value = "";
                    return;
                }
            }

            setFormData((prev) => ({
                ...prev,
                [name]: file,
            }));

            return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Submit driver application
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.agreeInformation ||
            !formData.agreeBackground ||
            !formData.agreeTerms
        ) {
            alert("Please accept all three agreements.");
            return;
        }

        const API =
            import.meta.env.VITE_API || "http://localhost:5000/api";

        const data = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (value instanceof File) {
                data.append(key, value);
            } else if (value !== null && value !== undefined) {
                data.append(key, String(value));
            }
        });

        try {
            setSubmitting(true);

            const response = await axios.post(
                `${API}/driver-applications`,
                data
            );

            console.log("Application saved:", response.data);

            alert("Application submitted successfully!");
            navigate("/");
        } catch (error) {
            console.error(
                "APPLICATION SUBMISSION ERROR:",
                error
            );

            console.error("STATUS:", error.response?.status);
            console.error("SERVER RESPONSE:", error.response?.data);

            alert(
                error.response?.data?.message ||
                "Failed to submit application. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="driver-application">
            <div className="application-card">
                <h1>Become a Nation Cabs Driver</h1>

                <p>
                    Complete the application below. Our recruitment
                    team will review your application and contact you.
                </p>

                <form onSubmit={handleSubmit}>
                    <h2>Personal Information</h2>

                    <div className="form-grid">
                        <input
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                        <div className="date-field">
                            <label htmlFor="dateOfBirth">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <h2>Address</h2>

                    <div className="form-grid">
                        <input
                            name="province"
                            placeholder="Province"
                            value={formData.province}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />

                        <input
                            className="full-width"
                            name="address"
                            placeholder="Residential Address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <h2>Driver Information</h2>

                    <div className="form-grid">
                        <input
                            name="licenseNumber"
                            placeholder="Driver's Licence Number"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            required
                        />

                        <div className="date-field">
                            <label htmlFor="licenseExpiry">
                                Driver's Licence Expiry Date
                            </label>
                            <input
                                type="date"
                                id="licenseExpiry"
                                name="licenseExpiry"
                                value={formData.licenseExpiry}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <input
                            name="pdpNumber"
                            placeholder="PrDP Number"
                            value={formData.pdpNumber}
                            onChange={handleChange}
                            required
                        />

                        <div className="date-field">
                            <label htmlFor="pdpExpiry">
                                PrDP Expiry Date
                            </label>
                            <input
                                type="date"
                                id="pdpExpiry"
                                name="pdpExpiry"
                                value={formData.pdpExpiry}
                                onChange={handleChange}
                            />
                        </div>

                        <input
                            type="number"
                            name="drivingExperience"
                            placeholder="Years of Driving Experience"
                            min="0"
                            value={formData.drivingExperience}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <h2>Emergency Contact</h2>

                    <div className="form-grid">
                        <input
                            name="emergencyName"
                            placeholder="Contact Name"
                            value={formData.emergencyName}
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="emergencyRelationship"
                            placeholder="Relationship"
                            value={formData.emergencyRelationship}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="tel"
                            name="emergencyPhone"
                            placeholder="Contact Number"
                            value={formData.emergencyPhone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <h2>Upload Documents</h2>

                    <div className="upload-grid">
                        <label>
                            South African ID
                            <input
                                type="file"
                                name="idDocument"
                                accept=".pdf,application/pdf"
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Driver's Licence with PrDP
                            <input
                                type="file"
                                name="licenseDocument"
                                accept=".pdf,application/pdf"
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Criminal Check Document
                            <input
                                type="file"
                                name="pdpDocument"
                                accept=".pdf,application/pdf"
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Proof of Address
                            <input
                                type="file"
                                name="proofOfAddress"
                                accept=".pdf,application/pdf"
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            E-Hailing Profile
                            <input
                                type="file"
                                name="driverProfile"
                                accept=".pdf,application/pdf"
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            CV Document
                            <input
                                type="file"
                                name="cv"
                                accept=".pdf,application/pdf"
                                onChange={handleChange}
                                required
                            />
                            <small>
                                Upload your CV in PDF format only.
                                Maximum size: 20 MB.
                            </small>
                        </label>
                    </div>

                    <div className="checkboxes">
                        <label>
                            <input
                                type="checkbox"
                                name="agreeInformation"
                                checked={formData.agreeInformation}
                                onChange={handleChange}
                                required
                            />
                            I confirm that the information provided
                            is accurate.
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="agreeBackground"
                                checked={formData.agreeBackground}
                                onChange={handleChange}
                                required
                            />
                            I consent to a background verification.
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                required
                            />
                            I agree to the Nation Cabs Terms and
                            Conditions.
                        </label>
                    </div>

                    <button
                        className="submit-btn"
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting
                            ? "Submitting..."
                            : "Submit Application"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DriverApplication;
