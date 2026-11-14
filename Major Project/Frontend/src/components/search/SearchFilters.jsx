import { MapPin, Building2, Search } from "lucide-react";
import Button from "../common/Button";

const POPULAR_CITIES = [
  "Bareilly",
  "Noida",
  "Delhi",
  "Gurgaon",
  "Lucknow",
  "Bengaluru",
  "Jaipur",
  "Mumbai",
  "Pune",
];

const PROPERTY_TYPES = [
  { value: "", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "flat", label: "Shared Flat" },
  { value: "independent", label: "Independent House / Villa" },
  { value: "pg", label: "PG / Hostel" },
];

/**
 * Filter panel with City Location and Property Type options.
 */
export default function SearchFilters({ filters = {}, onChange, onReset, onApply }) {
  const set = (patch) => {
    onChange?.({ ...filters, ...patch });
  };

  const handleApply = () => {
    onApply?.(filters);
  };

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          Filters
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-amber-600 hover:underline cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* City Location Filter with Search Input & Quick Chips */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <MapPin size={15} className="text-amber-500" /> City Location
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Type city (e.g. Bareilly, Noida)..."
            value={filters.city || ""}
            onChange={(e) => set({ city: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onApply?.({ ...filters, city: e.target.value });
              }
            }}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-800 placeholder-gray-400 focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
          />
        </div>

        {/* Quick Popular City Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {POPULAR_CITIES.map((c) => {
            const isSelected = filters.city?.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  const newCity = isSelected ? "" : c;
                  set({ city: newCity });
                  onApply?.({ ...filters, city: newCity });
                }}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Property Type Filter */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
          <Building2 size={15} className="text-amber-500" /> Property Type
        </label>
        <select
          value={filters.propertyType || ""}
          onChange={(e) => {
            set({ propertyType: e.target.value });
            onApply?.({ ...filters, propertyType: e.target.value });
          }}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:bg-white focus:border-amber-500 focus:outline-none transition-all cursor-pointer"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <Button
        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5"
        onClick={handleApply}
      >
        Apply Filters
      </Button>
    </div>
  );
}
