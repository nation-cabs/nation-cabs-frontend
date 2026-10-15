const DriverApplicationCard = ({
    application,
    reviewApplication
}) => {

    return (
        <div className="application-card">

            <div>
                <h3>
                    {application.first_name}{" "}
                    {application.last_name}
                </h3>

                <p>
                    {application.email}
                </p>

                <p>
                    {application.phone}
                </p>

                <p>
                    Status:{" "}
                    <strong>
                        {application.application_status}
                    </strong>
                </p>

                {/* Rejection reason */}
                {application.application_status === "rejected" &&
                    application.admin_notes && (

                    <div className="rejection-reason">

                        <p>
                            <strong>
                                Rejection Reason:
                            </strong>
                        </p>

                        <p>
                            {application.admin_notes}
                        </p>

                    </div>

                )}

            </div>


            <div className="application-actions">

                <button
                    onClick={() =>
                        reviewApplication(
                            application.id
                        )
                    }
                >
                    Review Application
                </button>

            </div>

        </div>
    );
};

export default DriverApplicationCard;