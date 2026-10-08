const DriverApplicationCard = ({
    application,
    reviewApplication,
    createDriverAccount
}) => {

    return (
        <div className="application-card">

            <div>
                <h3>
                    {application.first_name}{" "}
                    {application.last_name}
                </h3>

                <p>{application.email}</p>

                <p>{application.phone}</p>

                <p>
                    Status:{" "}
                    <strong>
                        {application.application_status}
                    </strong>
                </p>
            </div>

            <div className="application-actions">

                <button
                    onClick={() =>
                        reviewApplication(application.id)
                    }
                >
                    Review Application
                </button>

                {application.application_status === "approved" && (
                    <button
                        onClick={() =>
                            createDriverAccount(application.id)
                        }
                    >
                        Create Driver Account
                    </button>
                )}

            </div>

        </div>
    );
};

export default DriverApplicationCard;