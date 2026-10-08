import axios from "axios";

import { getToken } from "../utils/auth";

const API = import.meta.env.VITE_API;

export const getProfile = async () => {

    const response = await axios.get(

        `${API}/users/profile`,

        {

            headers: {

                Authorization: `Bearer ${getToken()}`

            }

        }

    );

    return response.data;

};

