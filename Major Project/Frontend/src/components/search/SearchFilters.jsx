import Select from "../common/Select";
import Button from "../common/Button";
import LocationSearch from "./LocationSearch";
import RadiusFilter from "./RadiusFilter";
import RentRange from "./RentRange";
import {
  PROPERTY_TYPES, SHARING_TYPES, FURNISHING_TYPES, GENDER_PREFERENCES, AMENITIES,
} from "../../utils/constants";

/**
 * Full advanced-search panel — combines location/radius/rent with the
 * property attribute filters. Shape matches the query params accepted by
 * GET /search (server/src/modules/search/search.service.js).
 */
export default function SearchFilters({ filters, onChange, onReset, onApply }) {
  const set = (patch) => onChange({ ...filters, ...patch });

  const toggleAmenity = (a) => {
    const current = filters.amenities ? filters.amenities.split(",").filter(Boolean) : [];
    const next = current.includes(a) ? current.filter((x) => x !== a) : [...current, a];
    set({ amenities: next.join(",") });
  };
  const selectedAmenities = filters.amenities ? filters.amenities.split(",") : [];

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Advanced filters</h2>
        <button onClick={onReset} className="text-xs font-medium text-brand-600 hover:underline">Reset</button>
      </div>

      <LocationSearch
        value={filters.city ? { label: filters.city } : null}
        onSelect={({ lat, lng, label }) => set({ lat, lng, city: label })}
      />

      <RadiusFilter
        value={Number(filters.radiusKm) || 5}
        onChange={(radiusKm) => set({ radiusKm })}
        disabled={!filters.lat || !filters.lng}
      />

      <RentRange
        min={filters.rentMin}
        max={filters.rentMax}
        onChange={({ rentMin, rentMax }) => set({ rentMin, rentMax })}
      />

      <Select label="Property type" placeholder="Any" options={PROPERTY_TYPES}
        value={filters.propertyType || ""} onChange={(e) => set({ propertyType: e.target.value })} />

      <Select label="Sharing type" placeholder="Any" options={SHARING_TYPES}
        value={filters.sharingType || ""} onChange={(e) => set({ sharingType: e.target.value })} />

      <Select label="Furnishing" placeholder="Any" options={FURNISHING_TYPES}
        value={filters.furnishing || ""} onChange={(e) => set({ furnishing: e.target.value })} />

      <Select label="Gender preference" placeholder="Any" options={GENDER_PREFERENCES}
        value={filters.genderPreference || ""} onChange={(e) => set({ genderPreference: e.target.value })} />

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Amenities</p>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                selectedAmenities.includes(a)
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {a.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      <Button className="w-full" onClick={onApply}>Apply filters</Button>
    </div>
  );
}
