const OPTIONS = [
  { value: "relevance", label: "Most relevant" },
  { value: "price", label: "Price: Low to High" },
  { value: "distance", label: "Nearest first" },
  { value: "rating", label: "Highest rated" },
];

/**
 * Maps to sortBy in server/src/modules/search/search.service.js
 * (relevance uses MongoDB text score; distance relies on $near's
 * natural ascending-distance order and requires lat/lng to be set).
 */
export default function SortDropdown({ value = "relevance", onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
      aria-label="Sort results"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
