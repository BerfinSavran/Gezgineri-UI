import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Marker icon fix for React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

interface PlaceMapPickerProps {
    latitude?: number;
    longitude?: number;
    onPositionChange: (lat: number, lng: number) => void;
}

const LocationMarker = ({ onPositionChange }: { onPositionChange: (lat: number, lng: number) => void }) => {
    const [position, setPosition] = useState<[number, number] | null>(null);

    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
            onPositionChange(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : <Marker position={position}></Marker>;
};


export default function PlaceMapPicker({ latitude, longitude, onPositionChange }: PlaceMapPickerProps) {
    const center: [number, number] = latitude && longitude
        ? [latitude, longitude]
        : [39.9334, 32.8597];

    return (
        <MapContainer center={center} zoom={13} style={{ height: "500px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker onPositionChange={onPositionChange} />
        </MapContainer>
    );
}
