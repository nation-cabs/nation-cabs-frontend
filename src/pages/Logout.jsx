import {logout} from "../utils/auth.js";
import { useNavigate } from "react-router-dom";

const handleLogout = () =>{
    const navigate = useNavigate();

    logout();
    navigate("/");

    return (
    <div className="logout">
        <h1>Logout</h1>
        
       <button onClick={handleLogout}>
    Logout
</button>

    </div>
);
}
export default handleLogout;