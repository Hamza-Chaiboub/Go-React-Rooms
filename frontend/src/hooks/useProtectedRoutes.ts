import { useEffect, useState } from "react"
import { apiFetch } from "../api/api"

type userType = {
    email: string;
    id: string;
    name: string;
}

export const useProtectedRoutes = () => {
    const [user, setUser] = useState<userType | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const apiUrl = import.meta.env.VITE_API_URL as string

    useEffect (() => {
        let cancelled = false

        async function fetchMe() {
            try {
                const res = await apiFetch(`${apiUrl}`, "/me")

                if (res.status === 401) {
                    if (!cancelled) setUser(null)
                    return
                }

                if (!res.ok) {
                    if (!cancelled) setUser(null)
                    return
                }

                const userData = await res.json()
                if (!cancelled) setUser(userData)
            } catch (e) {
                if (!cancelled) setUser(null)
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }

        fetchMe()

        return () => {
            cancelled = true
        }

    }, [apiUrl])
    return [user, isLoading] as const
}