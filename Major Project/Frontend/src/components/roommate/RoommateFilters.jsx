import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

const FOOD_OPTIONS = ["veg", "non_veg", "vegan", "no_preference"];
const GENDER_OPTIONS = ["male", "female", "other", "prefer_not_to_say"];

/**
 * Mirrors server/src/modules/roommates/roommate.service.js browseRoommates
 * filter params: city, budgetMax, food, gender.
 */
export default function RoommateFilters({ filters, onChange, onReset }) {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Filters</h2>
        <button onClick={onReset} className="text-xs font-medium text-brand-600 hover:underline">
          Reset
        </button>
      </div>

      <Input label="Preferred city" placeholder="e.g. Bengaluru"
        value={filters.city || ""} onChange={(e) => set("city", e.target.value)} />

      <Input label="Max budget (₹/mo)" type="number"
        value={filters.budgetMax || ""} onChange={(e) => set("budgetMax", e.target.value)} />

      <Select label="Food habit" placeholder="Any" options={FOOD_OPTIONS}
        value={filters.food || ""} onChange={(e) => set("food", e.target.value)} />

      <Select label="Gender" placeholder="Any" options={GENDER_OPTIONS}
        value={filters.gender || ""} onChange={(e) => set("gender", e.target.value)} />

      <Button variant="secondary" className="w-full" onClick={onReset}>
        Clear all filters
      </Button>
    </div>
  );
}
