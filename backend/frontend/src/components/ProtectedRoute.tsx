import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "@/constants";
import React, { useEffect, useState } from "react";

const ProtectedRoute = (props: {children: React.ReactNode}) => {
    const [isAuthorized, setIstAuthorized] = useState<boolean | null>(null) 

    useEffect(() => {
        auth().catch(() => setIstAuthorized(false))
    }, [])

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("api/token/refresh", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIstAuthorized(true)
            } else {
                setIstAuthorized(false)
            }
        } catch (error) {
            console.log(error)
            setIstAuthorized(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)

        if (!token) {
            setIstAuthorized(false)
            return
        }

        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp ? decoded.exp : 0
        const now = Date.now() / 1000
        if (tokenExpiration < now || tokenExpiration === undefined) {
            await refreshToken()
        } else {
            setIstAuthorized(true)
        }
    }

    if (isAuthorized === null) {
        return (<div>
            Betoltes...
        </div>)
    }

    return isAuthorized ? props.children : <Navigate to="/login"/>
}

export default ProtectedRoute