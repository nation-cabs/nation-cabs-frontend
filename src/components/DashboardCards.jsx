
function DashboardCards() {
    const stats = [
        { title: "Upcoming", count: 2, icon: "🗓️", type: "upcoming" },
        { title: "Completed", count: 15, icon: "✓", type: "completed" },
        { title: "Pending", count: 1, icon: "◷", type: "pending" },
        { title: "Cancelled", count: 0, icon: "×", type: "cancelled" },
    ];

    return (
        <div className="stats">
            {stats.map((stat) => (
                <div className={`stat-card ${stat.type}`} key={stat.type}>
                    <div className="stat-card-top">
                        <span className="stat-title">{stat.title}</span>
                        <span className="stat-icon" aria-hidden="true">
                            {stat.icon}
                        </span>
                    </div>

                    <h2>{stat.count}</h2>
                    <p className="stat-description">
                        {stat.title} bookings
                    </p>
                </div>
            ))}
        </div>
    );
}

export default DashboardCards;
