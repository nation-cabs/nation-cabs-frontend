import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserProfile.css";

const API = import.meta.env.VITE_API || "http://localhost:5000/api";
const SERVER_URL = API.replace(/\/api\/?$/, "");

function UserProfile() {
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: ""
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPicture, setUploadingPicture] = useState(false);

    const [selectedPicture, setSelectedPicture] = useState(null);
    const [picturePreview, setPicturePreview] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Authentication configuration
    const getAuthConfig = () => {
        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("userToken");

        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    // Load the user's profile
    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API}/profile`,
                getAuthConfig()
            );

            const profile = response.data.user || response.data;

            setUser(profile);

            setFormData({
                first_name: profile.first_name || "",
                last_name: profile.last_name || "",
                email: profile.email || "",
                phone: profile.phone || ""
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not load your profile. Please sign in again if needed."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    // Preview selected picture
    useEffect(() => {
        if (!selectedPicture) {
            setPicturePreview("");
            return;
        }

        const previewUrl = URL.createObjectURL(selectedPicture);

        setPicturePreview(previewUrl);

        return () => {
            URL.revokeObjectURL(previewUrl);
        };
    }, [selectedPicture]);

    // Handle changes to profile fields
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Save profile details
    const handleSave = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");
        setSaving(true);

        try {
            const response = await axios.put(
                `${API}/profile`,
                formData,
                getAuthConfig()
            );

            const updatedUser = response.data.user || response.data;

            setUser((previous) => ({
                ...previous,
                ...updatedUser
            }));

            setFormData({
                first_name:
                    updatedUser.first_name ?? formData.first_name,

                last_name:
                    updatedUser.last_name ?? formData.last_name,

                email:
                    updatedUser.email ?? formData.email,

                phone:
                    updatedUser.phone ?? formData.phone
            });

            setEditing(false);

            setMessage(
                response.data.message ||
                "Your profile has been updated successfully."
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not save your profile. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    // Cancel editing
    const handleCancel = () => {
        setFormData({
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            email: user?.email || "",
            phone: user?.phone || ""
        });

        setEditing(false);
        setError("");
        setMessage("");
    };

    // Select a profile picture
    const handlePictureChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            setError("Please select a JPG, PNG, or WEBP image.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Your picture must be smaller than 5 MB.");
            event.target.value = "";
            return;
        }

        setSelectedPicture(file);
        setError("");
        setMessage("");
    };

    // Upload profile picture
    const handlePictureUpload = async () => {
        if (!selectedPicture) {
            setError("Please choose a picture first.");
            return;
        }

        setUploadingPicture(true);
        setError("");
        setMessage("");

        try {
            const uploadData = new FormData();

            uploadData.append(
                "profile_picture",
                selectedPicture
            );

            const config = getAuthConfig();

            const response = await axios.post(
                `${API}/profile/picture`,
                uploadData,
                {
                    ...config,
                    headers: {
                        ...config.headers,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            const updatedUser =
                response.data.user || response.data;

            setUser((previous) => ({
                ...previous,
                ...updatedUser
            }));

            setSelectedPicture(null);

            setMessage(
                response.data.message ||
                "Profile picture uploaded successfully."
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Could not upload your picture. Please try again."
            );
        } finally {
            setUploadingPicture(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="profile-page">
                <p>Loading your profile...</p>
            </div>
        );
    }

    // Error state
    if (!user) {
        return (
            <div className="profile-page">
                <div className="profile-card">
                    <h2>My Profile</h2>

                    <p className="profile-error">
                        {error}
                    </p>

                    <button
                        type="button"
                        className="profile-save-btn"
                        onClick={loadProfile}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Profile initials
    const initials = (
        `${formData.first_name?.charAt(0) || ""}` +
        `${formData.last_name?.charAt(0) || ""}`
    ).toUpperCase() || "U";

    // Saved profile picture
    const savedPicture = user.profile_picture
        ? user.profile_picture.startsWith("http")
            ? user.profile_picture
            : `${SERVER_URL}${user.profile_picture}`
        : "";

    // Picture displayed on the profile
    const displayedPicture =
        picturePreview || savedPicture;

    return (
        <div className="profile-page">

            {/* Profile Heading */}
            <div className="profile-heading">
                <h1>My Profile</h1>

                <p>
                    View and manage your Nation Cabs account details.
                </p>
            </div>

            {/* Profile Card */}
            <section className="profile-card">

                {/* Profile Picture Section */}
                <div className="profile-banner">

                    <div className="profile-picture-container">

                        {displayedPicture ? (
                            <img
                                src={displayedPicture}
                                alt="Profile"
                                className="profile-avatar-image"
                                onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            <div className="profile-avatar">
                                {initials}
                            </div>
                        )}

                        <label
                            htmlFor="profile-picture"
                            className="profile-picture-label"
                        >
                            Choose Picture
                        </label>

                        <input
                            id="profile-picture"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handlePictureChange}
                            className="profile-picture-input"
                        />

                        {selectedPicture && (
                            <button
                                type="button"
                                className="profile-upload-btn"
                                onClick={handlePictureUpload}
                                disabled={uploadingPicture}
                            >
                                {uploadingPicture
                                    ? "Uploading..."
                                    : "Upload Picture"}
                            </button>
                        )}

                    </div>

                    <div className="profile-banner-details">
                        <h2>
                            {formData.first_name || "Your"}{" "}
                            {formData.last_name || "Profile"}
                        </h2>

                        <p>{formData.email}</p>
                    </div>

                </div>

                {/* Success Message */}
                {message && (
                    <p className="profile-success">
                        {message}
                    </p>
                )}

                {/* Error Message */}
                {error && (
                    <p className="profile-error">
                        {error}
                    </p>
                )}

                {/* Personal Information Heading */}
                <div className="profile-section-heading">

                    <div>
                        <h3>Personal Information</h3>

                        <p>
                            Keep your contact details up to date.
                        </p>
                    </div>

                    {!editing && (
                        <button
                            type="button"
                            className="profile-edit-btn"
                            onClick={() => {
                                setEditing(true);
                                setMessage("");
                                setError("");
                            }}
                        >
                            Edit Profile
                        </button>
                    )}

                </div>

                {/* Profile Form */}
                <form onSubmit={handleSave}>

                    <div className="profile-form-grid">

                        {/* First Name */}
                        <div className="profile-field">
                            <label htmlFor="first_name">
                                First Name
                            </label>

                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                value={formData.first_name}
                                onChange={handleChange}
                                disabled={!editing}
                                required
                            />
                        </div>

                        {/* Last Name */}
                        <div className="profile-field">
                            <label htmlFor="last_name">
                                Last Name
                            </label>

                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                value={formData.last_name}
                                onChange={handleChange}
                                disabled={!editing}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="profile-field">
                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={!editing}
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div className="profile-field">
                            <label htmlFor="phone">
                                Phone Number
                            </label>

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!editing}
                                placeholder="Enter your phone number"
                            />
                        </div>

                        {/* Account Type */}
                        <div className="profile-field">
                            <label htmlFor="account-type">
                                Account Type
                            </label>

                            <input
                                id="account-type"
                                value={user.role || "customer"}
                                disabled
                            />
                        </div>

                        {/* Email Verification */}
                        <div className="profile-field">
                            <label htmlFor="email-verification">
                                Email Verification
                            </label>

                            <input
                                id="email-verification"
                                value={
                                    Number(user.is_verified) === 1
                                        ? "Verified"
                                        : "Not verified"
                                }
                                disabled
                            />
                        </div>

                    </div>

                    {/* Save and Cancel Buttons */}
                    {editing && (
                        <div className="profile-actions">

                            <button
                                type="submit"
                                className="profile-save-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                className="profile-cancel-btn"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                        </div>
                    )}

                </form>

            </section>

        </div>
    );
}

export default UserProfile;
