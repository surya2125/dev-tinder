import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: location.hostname === "localhost" ? "http://localhost:6565" : "/api",
    withCredentials: true
});
