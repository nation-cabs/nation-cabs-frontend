import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth.js";
import { logout } from "../utils/auth.js";

const LogoutButton = () => {
const navigate = useNavigate();
const LogoutButton = () => {
const navigate = useNavigate();


const handleLogout = () => {
    const confirmed = window.confirm(
        "Are you sure you want to logout?"
    );

    if (confirmed) {
        logout();
        navigate("/login", { replace: true });
    }
};

const handleLogout = () => {
    const confirmed = window.confirm(
        "Are you sure you want to logout?"
    );

    if (confirmed) {
        logout();
        navigate("/login", { replace: true });
    }
};

return (
    <button
        type="button"
        className="logout-button"
        onClick={handleLogout}
    >
        Logout
    </button>
);


};

export default LogoutButton;