import "../styles/DashboardHeader.css";

function DashboardHeader() {

    //RENDER USER NAME

    const user = JSON.parse(localStorage.getItem("user" ) || "{}");
    const userName = user.firstName

    return (
        <div className="dashboard-header">
            <div className="header-text">
                <h1>Welcome Back,{userName}!</h1>
                <p>Manage your transport bookings.</p>
            </div>
        </div>
    );
}

export default DashboardHeader;
