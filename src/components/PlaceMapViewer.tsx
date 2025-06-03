// PlaceMapViewer.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Place } from "../types";
import L from "leaflet";

interface Props {
    place: Place;
}

export default function PlaceMapViewer({ place }: Props) {
    if (!place.latitude || !place.longitude) return <p>Konum bilgisi yok.</p>;

    const position: [number, number] = [place.latitude, place.longitude];

    return (
        <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            style={{ width: "100%", height: "500px", borderRadius: "8px" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={L.icon({
                iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
            })}>
                <Popup>
                    <strong>{place.name}</strong><br />
                    {place.city}, {place.country}
                </Popup>
            </Marker>
        </MapContainer>
    );
}
