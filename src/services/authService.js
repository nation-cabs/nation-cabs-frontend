import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: {
    "Content-Type": "application/json",
  },

});

export const signupUser = async (userData) => {

  
const response = await API.post(`/auth/signup`, 
  {
   headers: {
    'Content-Type': 'application/json',
           'Authorization': `Bearer ${response.token}` 

 },
 } , userData);
  return response.data;

  
}

export const loginUser = async (userData) => {

  try{
  const response = await API.post(`/auth/login`, {
    headers: {
      'Content-Type': 'application/json',
  'Authorization' : `Bearer ${response.token}`,
  },
 } , userData)
  ;
  return response.data;
} catch(error) {
    console.error('Cannot log you in', error.message)
}

}

export const logoutUser =  () => {

localStorage.removeItem("token");

}

export const createToken =  (user) => {

    localStorage.setItem("token", user.token);
}

export const getToken =  () => {
    return localStorage.getItem("token");
}

