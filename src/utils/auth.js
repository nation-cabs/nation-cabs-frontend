
export const saveToken = (token) => {
    localStorage.setItem("userToken", token);
};

export const getToken = () => {
    return localStorage.getItem("userToken");
};

export const saveUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

export const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
};
