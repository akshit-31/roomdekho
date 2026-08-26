import Select from "../common/Select";
import Input from "../common/Input";
import Button from "../common/Button";
import {
  PROPERTY_TYPES, SHARING_TYPES, FURNISHING_TYPES, GENDER_PREFERENCES, AMENITIES,
} from "../../utils/constants";

/**
 * Attribute-only filters (type/sharing/furnishing/amenities/gender).
 * Location + radius + rent-range live in the search/ components since
 * they're specific to the map-based search experience.
 */
export default function PropertyFilters({ filters, onChange, onReset }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  const toggleAmenity = (a) => {
    const current = filters.amenities ? filters.amenities.split(",").filter(Boolean) : [];
    const next = current.includes(a) ? current.filter((x) => x !== a) : [...current, a];
    set("amenities", next.join(","));
  };

  const selectedAmenities = filters.amenities ? filters.amenities.split(",") : [];

  return (
    <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        <button onClick={onReset} className="text-xs font-medium text-brand-600 hover:underline">
          Reset
        </button>
      </div>

      <Select label="Property type" placeholder="Any" options={PROPERTY_TYPES}
        value={filters.propertyType || ""} onChange={(e) => set("propertyType", e.target.value)} />

      <Select label="Sharing type" placeholder="Any" options={SHARING_TYPES}
        value={filters.sharingType || ""} onChange={(e) => set("sharingType", e.target.value)} />

      <Select label="Furnishing" placeholder="Any" options={FURNISHING_TYPES}
        value={filters.furnishing || ""} onChange={(e) => set("furnishing", e.target.value)} />

      <Select label="Gender preference" placeholder="Any" options={GENDER_PREFERENCES}
        value={filters.genderPreference || ""} onChange={(e) => set("genderPreference", e.target.value)} />

      <Input label="Move in after" type="date"
        value={filters.moveInAfter || ""} onChange={(e) => set("moveInAfter", e.target.value)} />

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">Amenities</p>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => (
            <button
              key={a}
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

      <Button variant="secondary" className="w-full" onClick={onReset}>
        Clear all filters
      </Button>
    </div>
  );
}
