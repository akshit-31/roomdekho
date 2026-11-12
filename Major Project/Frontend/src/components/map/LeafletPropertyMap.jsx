import { useEffect, useRef } from "react";
import L from "leaflet";

export default function LeafletPropertyMap({ location, title, city = "Delhi" }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const lat = location?.lat || location?.latitude || (location?.coordinates?.[1]) || 28.6139;
  const lng = location?.lng || location?.longitude || (location?.coordinates?.[0]) || 77.2090;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: ["a", "b", "c"],
      }).addTo(map);

      // Custom Pin Marker
      const customIcon = L.divIcon({
        className: "property-pin",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="
              position: absolute;
              width: 36px;
              height: 36px;
              background: rgba(245, 158, 11, 0.35);
              border-radius: 50%;
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              width: 28px;
              height: 28px;
              background: #f59e0b;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 13px;
            ">
              🏠
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; padding: 2px;">
          <strong style="color: #0f172a; font-size: 13px;">${title || "Room Location"}</strong>
          <p style="margin: 4px 0 0; color: #64748b;">📍 ${location?.address || city}</p>
        </div>
      `).openPopup();

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([lat, lng], 14);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, title, location?.address, city]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Property Location</h3>
          <p className="text-xs text-slate-500">
            {location?.address ? location.address : `Based in ${city}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 px-2.5 py-1 text-[11px] font-bold text-slate-700 transition-all shadow-sm"
            title="Open in Google Maps for directions"
          >
            <span>🧭 Directions</span>
          </a>
          <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
            📍 Verified Area
          </span>
        </div>
      </div>
      <div
        ref={mapContainerRef}
        className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-inner border border-slate-100"
      />
    </div>
  );
}

