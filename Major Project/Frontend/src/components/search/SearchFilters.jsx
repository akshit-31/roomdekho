import { MapPin, Building2 } from "lucide-react";
import Button from "../common/Button";

const CITIES = ["Delhi", "Noida", "Gurgaon", "Bengaluru", "Jaipur", "Mumbai"];
const PROPERTY_TYPES = [
  { value: "", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "flat", label: "Shared Flat" },
  { value: "independent", label: "Independent House / Villa" },
  { value: "pg", label: "PG / Hostel" },
];

/**
 * Filter panel with City Location and Property Type dropdown options.
 */
export default function SearchFilters({ filters, onChange, onReset, onApply }) {
  const set = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          Filters
        </h2>
        <button onClick={onReset} className="text-xs font-semibold text-amber-600 hover:underline">
          Reset
        </button>
      </div>

      {/* City Filter */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <MapPin size={15} className="text-amber-500" /> City Location
        </label>
        <select
          value={filters.city || ""}
          onChange={(e) => set({ city: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:bg-white focus:border-amber-500 focus:outline-none transition-all cursor-pointer"
        >
          <option value="">All Cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Property Type Filter */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <Building2 size={15} className="text-amber-500" /> Property Type
        </label>
        <select
          value={filters.propertyType || ""}
          onChange={(e) => set({ propertyType: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:bg-white focus:border-amber-500 focus:outline-none transition-all cursor-pointer"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold" onClick={onApply}>
        Apply Filters
      </Button>
    </div>
  );
}
