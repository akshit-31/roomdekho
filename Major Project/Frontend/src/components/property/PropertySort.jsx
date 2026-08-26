const OPTIONS = [
  { value: "relevance", label: "Most relevant" },
  { value: "price", label: "Price: Low to High" },
  { value: "distance", label: "Nearest first" },
  { value: "rating", label: "Highest rated" },
];

export default function PropertySort({ value = "relevance", onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      Sort by
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-gray-300 px-2.5 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}
