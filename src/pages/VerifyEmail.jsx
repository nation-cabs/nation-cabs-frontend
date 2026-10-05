import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";import { useNavigate } from "react-router-dom";


function VerifyEmail() {

    const API = import.meta.env.VITE_API;

    const [searchParams] = useSearchParams();

    const [message, setMessage] = useState("Verifying your email...");

    const navigate = useNavigate();

    useEffect(() => {

        const verify = async () => {

            try {

                const token = searchParams.get("token");

                console.log("API:", API);
                console.log("Token:", token);

                const response = await axios.get(
                    `${API}/auth/verify-email?token=${token}`
                );

                console.log(response.data);

                setMessage(response.data.message);

                setTimeout(() => {
                    navigate("/login");
                }, 2000);

            } catch (error) {

                console.error(error);

                setMessage(
                    error.response?.data?.message ||
                    error.message
                );

            }

        };

        verify();

    }, []);

    return <h2>{message}</h2>;

}

export default VerifyEmail;