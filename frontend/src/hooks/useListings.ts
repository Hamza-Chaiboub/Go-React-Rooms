import { useCallback, useEffect, useState } from "react"
import { apiFetch } from "../api/api"


export type Listing = {
    id: string
    userId: string
    title: string
    description: string
    addressLine1: string
    city: string
    province: string
    country: string
    postalCode: string
    latitude: number
    longitude: number
    bedrooms: number
    bathrooms: number
    area: number
    areaUnit: string
    price: number
    currency: string
    availableFrom: string
    availableUntil: string
    minLeaseDays: number
    isFurnished: boolean
    petsAllowed: boolean
    smokingAllowed: boolean
    parkingAvailable: boolean
    status: string
    createdAt: string
    updatedAt: string
    thumbnail: [{
        ID: string
        s3Key: string
        AltText: string
    }]
}

export const useListings = () => {
    const apiUrl = import.meta.env.VITE_API_URL as string

    const [listings, setListings] = useState<Listing[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    const refreshListings = useCallback(() => {
        setRefreshTrigger(prev => prev + 1)
    }, [])

    useEffect(() => {
        let isMounted = true

        async function getAllListings() {
            try {
                setIsLoading(true)
                setError(null)

                const res = await apiFetch(apiUrl, "/listings")

                if(!res.ok) {
                    throw new Error(`HTTP ${res.status}`)
                }

                const data = await res.json()

                if(isMounted) {
                    setListings(data.listings ?? [])
                }
            } catch(error) {
                console.error("failed to fetch listings", error)
                if(isMounted) {
                    setError("Failed to load listings")
                }
            } finally {
                if(isMounted) {
                    setIsLoading(false)
                }
            }
        }

        getAllListings()

        return () => {
            isMounted = false
        }
    }, [apiUrl, refreshTrigger])

    return {
        listings,
        isLoading,
        error,
        refreshListings
    }
}