import { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

type MapType = {
    className?: string;
}

export const Map = ({ className }: MapType) => {
    const [location, setLocation] = useState<number[] | null>(null)
    const [locationError, setLocationError] = useState<string | null>(null)

    const fetchIPGeolocation = useCallback(async () => {
        try {
            const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client')

            if (!res.ok) {
                throw new Error('IP geolocation request failed')
            }

            const data = await res.json()

            if (data.latitude != null && data.longitude != null) {
                setLocation([data.latitude, data.longitude])
            } else {
                throw new Error('No coordinates in IP geolocation response')
            }
        } catch (error) {
            setLocationError('unable to determine your location. Please enter it manually')
            console.error('IP geolocation error: ', error)
        }
    }, [])

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser")
            fetchIPGeolocation()
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation([
                    position.coords.latitude,
                    position.coords.longitude
                ])
            },
            (err) => {
                setLocationError(err.message)
                fetchIPGeolocation()
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        )
        console.log(location)
    }, [])

    if (!location) {
        if (locationError) {
            console.log('locationError')
            return <div>Error: {locationError}</div>
        }
        console.log("!location")
        return <div>Getting the location data...</div>
    }
    return (
        <>
            <MapContainer className={className} center={location} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={location}>
                    <Popup>A simple marker with a popup.</Popup>
                </Marker>
            </MapContainer>
        </>
    )
}