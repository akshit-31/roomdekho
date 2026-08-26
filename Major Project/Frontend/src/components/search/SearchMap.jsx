import { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, InfoWindow, Circle, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import { GOOGLE_MAPS_API_KEY, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "../../config/map.config";
import { formatCurrency } from "../../utils/formatCurrency";
import placeholderRoom from "../../assets/images/placeholder-room.jpg";

const containerStyle = { width: "100%", height: "100%", borderRadius: "1rem" };

// Cleaner basemap — hide the default clutter (POI icons, transit labels)
// so room pins stay the focus.
const MAP_STYLES = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
];

function shortPrice(rent) {
  if (rent >= 100000) return `₹${(rent / 100000).toFixed(1)}L`;
  if (rent >= 1000) return `₹${(rent / 1000).toFixed(rent % 1000 === 0 ? 0 : 1)}k`;
  return `₹${rent}`;
}

function pinIcon(rent, active) {
  const label = shortPrice(rent);
  const width = Math.max(54, label.length * 9 + 22);
  const fill = active ? "#1f63d1" : "#2f7ef0";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="36">
      <rect x="1" y="1" width="${width - 2}" height="26" rx="13" fill="${fill}" stroke="white" stroke-width="2"/>
      <text x="${width / 2}" y="18" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">${label}</text>
      <polygon points="${width / 2 - 6},27 ${width / 2 + 6},27 ${width / 2},35" fill="${fill}"/>
    </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(width, 36),
    anchor: new window.google.maps.Point(width / 2, 35),
  };
}

function originIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22">
      <circle cx="11" cy="11" r="9" fill="#2f7ef0" fill-opacity="0.18"/>
      <circle cx="11" cy="11" r="5" fill="#2f7ef0" stroke="white" stroke-width="2.5"/>
    </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(22, 22),
    anchor: new window.google.maps.Point(11, 11),
  };
}

/**
 * @param {Array} rooms - listings with `location.coordinates` [lng, lat]
 * @param {{lat:number,lng:number}} [center] - search origin, e.g. from LocationSearch
 * @param {number} [radiusKm] - draws a translucent circle around `center` when set
 */
export default function SearchMap({ rooms = [], center, radiusKm }) {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [activeRoom, setActiveRoom] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    id: "room-searcher-map",
  });

  const pinned = rooms.filter((r) => r.location?.coordinates?.length === 2);

  // Fit the viewport to whatever pins are currently on screen, falling back
  // to the search origin (or the app default) when there's nothing to show.
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const map = mapRef.current;

    if (pinned.length === 0) {
      map.panTo(center || DEFAULT_MAP_CENTER);
      map.setZoom(DEFAULT_MAP_ZOOM);
      return;
    }

    const bounds = new window.google.maps.LatLngBounds();
    pinned.forEach((room) => {
      const [lng, lat] = room.location.coordinates;
      bounds.extend({ lat, lng });
    });
    if (center) bounds.extend(center);

    if (pinned.length === 1 && !center) {
      map.panTo(bounds.getCenter());
      map.setZoom(15);
    } else {
      map.fitBounds(bounds, 60);
    }
  }, [isLoaded, rooms, center]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isLoaded) {
    return <div className="h-full w-full animate-pulse rounded-2xl bg-gray-100" />;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center || DEFAULT_MAP_CENTER}
      zoom={DEFAULT_MAP_ZOOM}
      onLoad={(map) => { mapRef.current = map; }}
      options={{ styles: MAP_STYLES, streetViewControl: false, fullscreenControl: false, mapTypeControl: false }}
    >
      {center && (
        <>
          <Marker position={center} icon={originIcon()} zIndex={10} />
          {radiusKm > 0 && (
            <Circle
              center={center}
              radius={radiusKm * 1000}
              options={{
                strokeColor: "#2f7ef0",
                strokeOpacity: 0.35,
                strokeWeight: 1.5,
                fillColor: "#2f7ef0",
                fillOpacity: 0.06,
              }}
            />
          )}
        </>
      )}

      {pinned.map((room) => {
        const [lng, lat] = room.location.coordinates;
        const isActive = activeRoom?._id === room._id;
        return (
          <Marker
            key={room._id}
            position={{ lat, lng }}
            icon={pinIcon(room.rent, isActive)}
            zIndex={isActive ? 20 : 1}
            onClick={() => setActiveRoom(room)}
          />
        );
      })}

      {activeRoom && (() => {
        const [lng, lat] = activeRoom.location.coordinates;
        return (
          <InfoWindow position={{ lat, lng }} onCloseClick={() => setActiveRoom(null)}>
            <button
              type="button"
              onClick={() => navigate(`/rooms/${activeRoom._id}`)}
              className="block w-52 overflow-hidden rounded-lg text-left"
            >
              <img
                src={activeRoom.media?.[0]?.url || placeholderRoom}
                alt={activeRoom.title}
                className="h-24 w-full object-cover"
              />
              <div className="pt-2">
                <p className="line-clamp-1 text-sm font-semibold text-gray-900">{activeRoom.title}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={11} /> {activeRoom.address?.locality || activeRoom.address?.city}
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-sm font-bold text-brand-600">{formatCurrency(activeRoom.rent)}/mo</span>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-brand-600">
                    View <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </button>
          </InfoWindow>
        );
      })()}
    </GoogleMap>
  );
}
