import { useEffect, useRef, useState } from "react";
import { Outlet, Navigate } from "react-router-dom"
import { apiFetch } from "../api/api";

interface ProtectedRoutesProps {
    redirectTo? : string;
}

const ProtectedRoutes = ({ redirectTo = "/login" } : ProtectedRoutesProps) => {
    const [user, setUser] = useState(null)
    const [isAuth, setIsAuth] = useState(true)
    const apiUrl = import.meta.env.VITE_API_URL as string
    const didRun = useRef(false)

    useEffect (() => {
        if (didRun.current) return;
        didRun.current = true
        async function user() {
            try {
                const res = await apiFetch(`${apiUrl}`, "/me")

                if (!res.ok) {
                    setUser(null)
                    throw new Error(`HTTP ${res.status}`)
                }

                const userData = await res.json()
                setUser(userData)
                // console.log("got user", userData)
            } catch (e) {
                console.log("auth error", e)
            } finally {
                setIsAuth(false)
            }
        }

        user()
    }, [apiUrl])
    
    // const auth = user;
    if (isAuth) {
        return <div>Loading ...</div>
    }
    // console.log("user: ", user)
    console.log(window.location.pathname)

    return user ? <Outlet/> : <Navigate to={redirectTo} />;
}

export default ProtectedRoutes