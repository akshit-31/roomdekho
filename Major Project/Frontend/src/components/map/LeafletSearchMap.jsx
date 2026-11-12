import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import { formatCurrency } from "../../utils/formatCurrency";
import placeholderRoom from "../../assets/images/placeholder-room.jpg";

// Fix default Leaflet icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function formatPriceShort(rent) {
  if (rent >= 100000) return `₹${(rent / 100000).toFixed(1)}L`;
  if (rent >= 1000) return `₹${(rent / 1000).toFixed(rent % 1000 === 0 ? 0 : 1)}k`;
  return `₹${rent}`;
}

export default function LeafletSearchMap({ rooms = [], center, zoom = 12 }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const navigate = useNavigate();

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultLat = center?.lat || 28.6139;
      const defaultLng = center?.lng || 77.2090;

      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Add OpenStreetMap official real tile layer (100% free, no API keys, fully working)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: ["a", "b", "c"],
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when rooms or center changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const validRooms = rooms.filter((r) => {
      const lat = r.location?.lat || r.location?.latitude || (r.location?.coordinates?.[1]);
      const lng = r.location?.lng || r.location?.longitude || (r.location?.coordinates?.[0]);
      return lat && lng && !isNaN(lat) && !isNaN(lng);
    });

    if (validRooms.length === 0) {
      if (center?.lat && center?.lng) {
        map.setView([center.lat, center.lng], zoom);
      }
      return;
    }

    const bounds = L.latLngBounds();

    validRooms.forEach((room) => {
      const lat = room.location?.lat || room.location?.latitude || room.location?.coordinates[1];
      const lng = room.location?.lng || room.location?.longitude || room.location?.coordinates[0];
      const latLng = [lat, lng];
      bounds.extend(latLng);

      const priceLabel = formatPriceShort(room.rent || 0);

      // Custom Price Pill Icon
      const customIcon = L.divIcon({
        className: "custom-map-pin",
        html: `
          <div style="
            background: #f59e0b;
            color: #ffffff;
            font-weight: 800;
            font-size: 11px;
            padding: 4px 8px;
            border-radius: 9999px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid white;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
          ">
            ${priceLabel}
          </div>
        `,
        iconSize: [50, 26],
        iconAnchor: [25, 13],
      });

      const marker = L.marker(latLng, { icon: customIcon });

      // Rich Popup Card
      const popupHtml = `
        <div style="width: 220px; font-family: inherit;">
          <img 
            src="${room.media?.[0]?.url || room.images?.[0] || placeholderRoom}" 
            alt="${room.title}"
            style="width: 100%; height: 110px; object-fit: cover; border-radius: 12px; margin-bottom: 8px;"
          />
          <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: #0f172a; line-height: 1.3;">
            ${room.title || "Room Listing"}
          </h4>
          <p style="margin: 3px 0 6px 0; font-size: 11px; color: #64748b;">
            📍 ${room.locality ? room.locality + ", " : ""}${room.city || "Delhi"}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 6px;">
            <span style="font-size: 13px; font-weight: 800; color: #d97706;">
              ${formatCurrency(room.rent || 0)}<span style="font-size: 10px; font-weight: 500; color: #64748b;">/mo</span>
            </span>
            <a 
              href="/rooms/${room._id || room.id}" 
              style="
                background: #f59e0b;
                color: white;
                text-decoration: none;
                font-size: 10px;
                font-weight: 700;
                padding: 4px 8px;
                border-radius: 8px;
              "
            >
              View Listing
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 260, className: "room-popup" });
      layer.addLayer(marker);
    });

    if (validRooms.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (validRooms.length === 1) {
      const single = validRooms[0];
      const lat = single.location?.lat || single.location?.coordinates[1];
      const lng = single.location?.lng || single.location?.coordinates[0];
      map.setView([lat, lng], 14);
    }
  }, [rooms, center, zoom]);

  return (
    <div className="relative h-full w-full min-h-[450px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
      <div ref={mapContainerRef} className="h-full w-full min-h-[450px] z-10" />
      <div className="absolute top-3 right-3 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 pointer-events-none">
        <span>🗺️</span> {rooms.length} Room{rooms.length === 1 ? "" : "s"} on Map
      </div>
    </div>
  );
}

