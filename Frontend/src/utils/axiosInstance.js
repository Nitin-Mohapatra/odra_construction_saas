import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},(error)=>{
    return Promise.reject(error);
}
)

// response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("User_id");
            localStorage.removeItem("IsLogin");
            localStorage.removeItem("name");
            localStorage.removeItem("subscription");
            localStorage.removeItem("organizationId");
            localStorage.removeItem("role");
            toast.error("Session expired. Please login again.");
            // Cannot use React Router hooks here; use a simple redirect instead
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;