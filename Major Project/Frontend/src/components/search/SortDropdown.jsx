const OPTIONS = [
  { value: "relevance", label: "Most relevant" },
  { value: "price", label: "Price: Low to High" },
  { value: "distance", label: "Nearest first" },
  { value: "rating", label: "Highest rated" },
];

/**
 * Maps to sortBy in search queries with dark glassmorphic styling.
 */
export default function SortDropdown({ value = "relevance", onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-2xl border border-white/15 bg-slate-900/80 backdrop-blur-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg focus:border-amber-400 focus:outline-none transition-all cursor-pointer"
      aria-label="Sort results"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-900 text-white font-medium">
          {opt.label}
        </option>
      ))}
    </select>
  );
}
