import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapPicker = ({ location, onChange }) => {

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        onChange({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
          source: "MAP"
        });
      }
    });

    return location?.latitude ? (
      <Marker position={[location.latitude, location.longitude]} />
    ) : null;
  };

  return (
    <MapContainer
      center={[41.3, 69.2]}
      zoom={6}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
};

export default MapPicker;
