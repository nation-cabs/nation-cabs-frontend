
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
        agreeTerms: false
    });

    // ==========================================
    // HANDLE FORM CHANGES
    // ==========================================
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        // ==========================================
        // FILE INPUT
        // ==========================================
        if (type === "file") {
            const file = files?.[0];

            // No file selected
            if (!file) {
                return;
            }

            // ==========================================
            // DOCUMENT VALIDATION
            // ==========================================
            const documentFields = [
                "idDocument",
                "licenseDocument",
                "pdpDocument",
                "proofOfAddress",
                "driverProfile",
                "cv"
            ];

            if (documentFields.includes(name)) {
                const isPDF =
                    file.type === "application/pdf" &&
                    file.name.toLowerCase().endsWith(".pdf");

                if (!isPDF) {
                    alert(
                        "Only PDF files are allowed for this document."
                    );

                    e.target.value = "";
                    return;
                }

                const maxSize = 20 * 1024 * 1024; // 20 MB

                if (file.size > maxSize) {
                    alert(
                        "PDF file must not exceed 20 MB."
                    );

                    e.target.value = "";
                    return;
                }
            }

            // ==========================================
            // PROFILE PHOTO VALIDATION
            // ==========================================
           
            // ==========================================
            // SAVE FILE TO STATE
            // ==========================================
            setFormData((prev) => ({
                ...prev,
                [name]: file
            }));

            console.log(
                `Selected ${name}:`,
                {
                    name: file.name,
                    type: file.type,
                    size: file.size
                }
            );

            return;
        }

        // ==========================================
        // TEXT / CHECKBOX INPUTS
        // ==========================================
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // ==========================================
    // HANDLE SUBMIT
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const API = import.meta.env.VITE_API;

        try {
            console.log(
                "========== FORM STATE =========="
            );

            console.log(formData);

            // ==========================================
            // CREATE FORMDATA
            // ==========================================
            const data = new FormData();

            // ==========================================
            // TEXT FIELDS
            // ==========================================
            data.append("firstName", formData.firstName);
            data.append("lastName", formData.lastName);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("dateOfBirth", formData.dateOfBirth);
            data.append("gender", formData.gender);

            data.append("province", formData.province);
            data.append("city", formData.city);
            data.append("address", formData.address);

            data.append(
                "licenseNumber",
                formData.licenseNumber
            );

            data.append(
                "licenseExpiry",
                formData.licenseExpiry
            );

            data.append(
                "pdpNumber",
                formData.pdpNumber
            );

            data.append(
                "pdpExpiry",
                formData.pdpExpiry
            );

            data.append(
                "drivingExperience",
                formData.drivingExperience
            );

            data.append(
                "emergencyName",
                formData.emergencyName
            );

            data.append(
                "emergencyRelationship",
                formData.emergencyRelationship
            );

            data.append(
                "emergencyPhone",
                formData.emergencyPhone
            );

            // ==========================================
            // CHECKBOXES
            // ==========================================
            data.append(
                "agreeInformation",
                String(formData.agreeInformation)
            );

            data.append(
                "agreeBackground",
                String(formData.agreeBackground)
            );

            data.append(
                "agreeTerms",
                String(formData.agreeTerms)
            );

            // ==========================================
            // FILES
            // ==========================================

            if (formData.idDocument) {
                data.append(
                    "idDocument",
                    formData.idDocument
                );
            }

            if (formData.licenseDocument) {
                data.append(
                    "licenseDocument",
                    formData.licenseDocument
                );
            }

            if (formData.pdpDocument) {
                data.append(
                    "pdpDocument",
                    formData.pdpDocument
                );
            }

            if (formData.proofOfAddress) {
                data.append(
                    "proofOfAddress",
                    formData.proofOfAddress
                );
            }

            if (formData.driverProfile) {
                data.append(
                    "driverProfile",
                    formData.driverProfile
                );
            }

            // ==========================================
            // CV
            // ==========================================
            // IMPORTANT:
            // Your state property is "cv", NOT "cv_document".
            if (formData.cv) {
                data.append(
                    "cv",
                    formData.cv
                );
            }

            // ==========================================
            // DEBUG FORMDATA
            // ==========================================
            console.log(
                "========== FORMDATA =========="
            );

            for (const [key, value] of data.entries()) {
                if (value instanceof File) {
                    console.log(key, {
                        name: value.name,
                        type: value.type,
                        size: value.size
                    });
                } else {
                    console.log(key, value);
                }
            }

            console.log(
                "=============================="
            );

            // ==========================================
            // SEND REQUEST
            // ==========================================
            const response = await axios.post(
                `${API}/driver-applications`,
                data
            );

            console.log(
                "Application saved:",
                response.data
            );

            alert(
                "Application submitted successfully!"
            );

            navigate("/");

        } catch (error) {
            console.error(
                "APPLICATION SUBMISSION ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "SERVER RESPONSE:",
                error.response?.data
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to submit application. Please try again."
            );
        }
    };

    return (
        <div className="driver-application">

            <div className="application-card">

                <h1>
                    Become a Nation Cabs Driver
                </h1>

                <p>
                    Complete the application below. Our
                    recruitment team will review your
                    application and contact you.
                </p>

                <form onSubmit={handleSubmit}>

                    {/* ==========================================
                        PERSONAL INFORMATION
                    ========================================== */}

                    <h2>Personal Information</h2>

                    <div className="form-grid">

                        <input
                            name="firstName"
                            placeholder="First Name"
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="lastName"
                            placeholder="Last Name"
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="phone"
                            placeholder="Phone Number"
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
            onChange={handleChange}
            required
        />
    </div>

                        <select
                            name="gender"
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Gender
                            </option>

                            <option value="Male">
                                Male
                            </option>

                            <option value="Female">
                                Female
                            </option>
                        </select>

                    </div>

                    {/* ==========================================
                        ADDRESS
                    ========================================== */}

                    <h2>Address</h2>

                    <div className="form-grid">

                        <input
                            name="province"
                            placeholder="Province"
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="city"
                            placeholder="City"
                            onChange={handleChange}
                            required
                        />

                        <input
                            className="full-width"
                            name="address"
                            placeholder="Residential Address"
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* ==========================================
                        DRIVER INFORMATION
                    ========================================== */}

                    <h2>Driver Information</h2>

                    <div className="form-grid">

                        <input
                            name="licenseNumber"
                            placeholder="Driver's Licence Number"
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
            onChange={handleChange}
            required
        />
    </div>

                        <input
                            name="pdpNumber"
                            placeholder="PDP Number"
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
            onChange={handleChange}
        />
    </div>

                        <input
                            type="number"
                            name="drivingExperience"
                            placeholder="Years of Driving Experience"
                            min="0"
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* ==========================================
                        EMERGENCY CONTACT
                    ========================================== */}

                    <h2>Emergency Contact</h2>

                    <div className="form-grid">

                        <input
                            name="emergencyName"
                            placeholder="Contact Name"
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="emergencyRelationship"
                            placeholder="Relationship"
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="emergencyPhone"
                            placeholder="Contact Number"
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* ==========================================
                        DOCUMENTS
                    ========================================== */}

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
                            E-Hailing  Profile

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

                    {/* ==========================================
                        AGREEMENTS
                    ========================================== */}

                    <div className="checkboxes">

                        <label>
                            <input
                                type="checkbox"
                                name="agreeInformation"
                                onChange={handleChange}
                                required
                            />

                            I confirm that the information
                            provided is accurate.
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="agreeBackground"
                                onChange={handleChange}
                                required
                            />

                            I consent to a background
                            verification.
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                onChange={handleChange}
                                required
                            />

                            I agree to the Nation Cabs
                            Terms and Conditions.
                        </label>

                    </div>

                    {/* ==========================================
                        SUBMIT
                    ========================================== */}

                    <button
                        className="submit-btn"
                        type="submit"
                    >
                        Submit Application
                    </button>

                </form>

            </div>

        </div>
    );
}

export default DriverApplication;
