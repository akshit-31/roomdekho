import { useEffect, useState } from "react";
import { MapPin, LocateFixed } from "lucide-react";
import { api } from "../../services/api/axios";
import { useDebounce } from "../../hooks/useDebounce";
import { useGeolocation } from "../../hooks/useGeolocation";

/**
 * Free-text location box backed by the backend's Google Maps proxy
 * (server/src/modules/maps — GET /maps/geocode) so the API key never
 * ships to the browser. Resolves to { lat, lng, label } for the search.
 */
export default function LocationSearch({ value, onSelect }) {
  const [query, setQuery] = useState(value?.label || "");
  const debounced = useDebounce(query, 500);
  const { coords } = useGeolocation();

  useEffect(() => {
    if (!debounced || debounced.length < 3) return;
    let cancelled = false;
    api
      .get("/maps/geocode", { params: { address: debounced } })
      .then(({ data }) => {
        if (!cancelled && data?.data) {
          onSelect({ lat: data.data.lat, lng: data.data.lng, label: debounced });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps

  const useMyLocation = () => {
    if (coords) {
      setQuery("Current location");
      onSelect({ ...coords, label: "Current location" });
    }
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
      <div className="relative">
        <MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="City or locality"
          className="w-full rounded-xl border border-gray-300 py-2 pl-9 pr-9 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="button"
          onClick={useMyLocation}
          title="Use current location"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-brand-600"
        >
          <LocateFixed size={16} />
        </button>
      </div>
    </div>
  );
}
