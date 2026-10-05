import { Link } from "react-router-dom";

function Unauthorized() {

    return (

        <div className="unauthorized">

            <h1>403</h1>

            <h2>Access Denied</h2>

            <p>
                You don't have permission to view this page.
            </p>

            <Link to="/">
                Go Home
            </Link>

        </div>

    );

}

export default Unauthorized;