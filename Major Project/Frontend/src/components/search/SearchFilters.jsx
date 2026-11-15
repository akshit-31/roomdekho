import { MapPin, Building2 } from "lucide-react";
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
 * Filter panel with dark luxury glassmorphic styling.
 */
export default function SearchFilters({ filters = {}, onChange, onReset, onApply }) {
  const set = (patch) => {
    onChange?.({ ...filters, ...patch });
  };

  const handleApply = () => {
    onApply?.(filters);
  };

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl text-white">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
          Filters
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* City Location Filter with Search Input & Quick Chips */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
          <MapPin size={15} className="text-amber-400" /> City Location
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
            className="w-full rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-2.5 text-xs font-semibold text-white placeholder-slate-400 focus:border-amber-400 focus:bg-slate-950 focus:outline-none transition-all"
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
                className={`rounded-xl px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md border border-amber-300/40"
                    : "bg-white/10 text-slate-300 border border-white/10 hover:bg-white/15 hover:text-white"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Property Type Filter */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
          <Building2 size={15} className="text-amber-400" /> Property Type
        </label>
        <select
          value={filters.propertyType || ""}
          onChange={(e) => {
            set({ propertyType: e.target.value });
            onApply?.({ ...filters, propertyType: e.target.value });
          }}
          className="w-full rounded-2xl border border-white/15 bg-slate-950/80 px-4 py-2.5 text-xs font-semibold text-white focus:border-amber-400 focus:outline-none transition-all cursor-pointer"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value} className="bg-slate-900 text-white">
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <Button
        onClick={handleApply}
        className="w-full !bg-gradient-to-r !from-amber-500 !to-orange-500 hover:!from-amber-600 hover:!to-orange-600 !text-white font-black text-xs py-3 rounded-2xl shadow-lg shadow-amber-500/25 transition-all hover:scale-102 active:scale-95 border border-amber-300/30"
      >
        Apply Filters
      </Button>
    </div>
  );
}
