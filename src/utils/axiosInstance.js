import axios from "axios";

export const axiosInstance = axios.create({
    // baseURL: location.hostname === "localhost" ? "http://localhost:6565/api/v1" : "/api",
    baseURL: "http://localhost:6565/api/v1",
    withCredentials: true
});
