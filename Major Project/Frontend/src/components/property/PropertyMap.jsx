import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY, DEFAULT_MAP_ZOOM } from "../../config/map.config";

const containerStyle = { width: "100%", height: "320px", borderRadius: "1rem" };

export default function PropertyMap({ location, title }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    id: "room-searcher-map",
  });

  if (!location?.coordinates) return null;
  const [lng, lat] = location.coordinates;
  const center = { lat, lng };

  if (!isLoaded) {
    return <div className="h-80 w-full animate-pulse rounded-2xl bg-gray-100" />;
  }

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={DEFAULT_MAP_ZOOM}>
      <MarkerF position={center} title={title} />
    </GoogleMap>
  );
}
