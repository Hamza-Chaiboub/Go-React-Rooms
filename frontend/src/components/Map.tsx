import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

type MapType = {
    position: number[];
    className?: string;
}

export const Map = ({ position, className }: MapType) => {
    return (
        <>
            <MapContainer className={className} center={position} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>A simple marker with a popup.</Popup>
                </Marker>
            </MapContainer>
        </>
    )
}