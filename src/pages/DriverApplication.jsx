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
        profilePhoto: null,
        cv: null,

        agreeInformation: false,
        agreeBackground: false,
        agreeTerms: false

    });

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
      "cv"
    ];

    const isDocument = documentFields.includes(name);

    // -------------------------
    // DOCUMENT VALIDATION
    // -------------------------
    if (isDocument) {
      const isPDF =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      if (!isPDF) {
        alert("Only PDF files are allowed for this document.");
        e.target.value = "";
        return;
      }

      const maxSize = 20 * 1024 * 1024; // 20 MB

      if (file.size > maxSize) {
        alert("PDF file must not exceed 20 MB.");
        e.target.value = "";
        return;
      }
    }

    // -------------------------
    // PROFILE PHOTO VALIDATION
    // -------------------------
    if (name === "profilePhoto") {
      const allowedTypes = [
        "image/jpeg",
        "image/png"
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Profile photo must be JPG, JPEG, or PNG.");
        e.target.value = "";
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5 MB

      if (file.size > maxSize) {
        alert("Profile photo must not exceed 5 MB.");
        e.target.value = "";
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: file
    }));

    return;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value
  }));
};
 const handleSubmit = async (e) => {
    e.preventDefault();

    const API = import.meta.env.VITE_API;

   try {
    console.log("Submitting application:", formData);

    const data = new FormData();

    // Text fields
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("dateOfBirth", formData.dateOfBirth);
    data.append("gender", formData.gender);

    data.append("province", formData.province);
    data.append("city", formData.city);
    data.append("address", formData.address);

    data.append("licenseNumber", formData.licenseNumber);
    data.append("licenseExpiry", formData.licenseExpiry);

    data.append("pdpNumber", formData.pdpNumber);
    data.append("pdpExpiry", formData.pdpExpiry);

    data.append(
        "drivingExperience",
        formData.drivingExperience
    );

    data.append("emergencyName", formData.emergencyName);
    data.append(
        "emergencyRelationship",
        formData.emergencyRelationship
    );
    data.append("emergencyPhone", formData.emergencyPhone);

    // Checkboxes
    data.append(
        "agreeInformation",
        formData.agreeInformation
    );

    data.append(
        "agreeBackground",
        formData.agreeBackground
    );

    data.append(
        "agreeTerms",
        formData.agreeTerms
    );

    // Files
    if (formData.idDocument) {
        data.append("idDocument", formData.idDocument);
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

    if (formData.profilePhoto) {
        data.append(
            "profilePhoto",
            formData.profilePhoto
        );
    }

    
    if (formData.cv) {
    data.append(
        "cv",
        formData.cv
    );
}
    // SEND FormData
    const response = await axios.post(
        `${API}/driver-applications`,
        data
    );

    console.log("Application saved:", response.data);

    alert("Application submitted successfully!");
      navigate("/");

} catch (error) {
    console.error("APPLICATION SUBMISSION ERROR:", error);
    console.error("STATUS:", error.response?.status);
    console.error("SERVER RESPONSE:", error.response?.data);
    console.error("MESSAGE:", error.message);
}
};

    return (

        <div className="driver-application">

            <div className="application-card">

                <h1>Become a Nation Cabs Driver</h1>

                <p>
                    Complete the application below. Our recruitment team
                    will review your application and contact you.
                </p>

                <form onSubmit={handleSubmit}>

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

                        <input
                            type="date"
                            name="dateOfBirth"
                            onChange={handleChange}
                            required
                        />

                        <select
                            name="gender"
                            onChange={handleChange}
                            required
                        >
                            <option value="">Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>

                    </div>

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

                    <h2>Driver Information</h2>

                    <div className="form-grid">

                        <input
                            name="licenseNumber"
                            placeholder="Driver's Licence Number"
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="date"
                            name="licenseExpiry"
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="pdpNumber"
                            placeholder="PDP Number"
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="date"
                            name="pdpExpiry"
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="number"
                            name="drivingExperience"
                            placeholder="Years of Driving Experience"
                            onChange={handleChange}
                            required
                        />

                    </div>

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
        Driver's Licence
        <input
            type="file"
            name="licenseDocument"
            accept=".pdf,application/pdf"
            onChange={handleChange}
            required
        />
    </label>

    <label>
        PDP Certificate
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
        CV
        <input
            type="file"
            name="cvDocument"
            accept=".pdf,application/pdf"
            onChange={handleChange}
            required
        />

        <small>
            Upload your CV in PDF format only. Maximum size: 20 MB.
        </small>
    </label>

    <label>
        Profile Photo
        <input
            type="file"
            name="profilePhoto"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            onChange={handleChange}
            required
        />
    </label>

</div>

                    <div className="checkboxes">

                        <label>

                            <input
                                type="checkbox"
                                name="agreeInformation"
                                onChange={handleChange}
                            />

                            I confirm that the information provided is accurate.

                        </label>

                        <label>

                            <input
                                type="checkbox"
                                name="agreeBackground"
                                onChange={handleChange}
                            />

                            I consent to a background verification.

                        </label>

                        <label>

                            <input
                                type="checkbox"
                                name="agreeTerms"
                                onChange={handleChange}
                            />

                            I agree to the Nation Cabs Terms and Conditions.

                        </label>

                    </div>

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