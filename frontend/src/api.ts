import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import { Navigate, useNavigate } from "react-router-dom";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})


api.interceptors.request.use(
    (config) => {
        console.log(config.data)
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
        (error) => {
            return Promise.reject(error)
        }
)

api.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {

        console.log("token")
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem(REFRESH_TOKEN)
                const response = await api.post("api/token/refresh/",
                    { refresh: refreshToken }
                )

                const newAccessToken = response.data.access
                localStorage.setItem(ACCESS_TOKEN, newAccessToken)
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

                return api(originalRequest)
            } catch (error) {
                const navigate = useNavigate();
                navigate("/login");

                console.error(error)
                localStorage.clear()
            }
        }
        return Promise.reject(error)
    }
)

export default api