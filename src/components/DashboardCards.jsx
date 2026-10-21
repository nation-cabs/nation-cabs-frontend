
function DashboardCards() {
    const stats = [
        {
            title: "Upcoming",
            count: 2,
            icon: "🗓️",
            type: "upcoming",
            description: "Scheduled rides"
        },
        {
            title: "Completed",
            count: 15,
            icon: "✓",
            type: "completed",
            description: "Successfully completed"
        },
        {
            title: "Pending",
            count: 1,
            icon: "◷",
            type: "pending",
            description: "Awaiting confirmation"
        },
        {
            title: "Cancelled",
            count: 0,
            icon: "×",
            type: "cancelled",
            description: "Cancelled rides"
        },
    ];

    return (
        <div className="stats">
            {stats.map((stat) => (
                <div
                    className={`stat-card ${stat.type}`}
                    key={stat.type}
                >
                    <div className="stat-card-top">
                        <span className="stat-title">
                            {stat.title}
                        </span>

                        <span
                            className="stat-icon"
                            aria-hidden="true"
                        >
                            {stat.icon}
                        </span>
                    </div>

                    <h2>{stat.count}</h2>

                    <p className="stat-description">
                        {stat.description}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default DashboardCards;

