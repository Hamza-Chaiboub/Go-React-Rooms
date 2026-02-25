import { useEffect } from "react"
import { apiFetch } from "../api/api"
import { useNavigate } from "react-router-dom"

export default function Logout() {
    const apiUrl = import.meta.env.VITE_API_URL as string
    const navigate = useNavigate()

    useEffect(() => {
        async function logout() {
            try {
                const res = await apiFetch(`${apiUrl}`, "/auth/logout")

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`)
                }

                navigate("/login")

            } catch (e) {
                console.log("error logout: ", e)
            }
        }
        logout()
    }, [apiUrl])
    return (
        <>

        </>
    )
}