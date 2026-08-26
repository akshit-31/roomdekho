const PRESETS = [1, 2, 5, 10, 20];

export default function RadiusFilter({ value = 5, onChange, disabled }) {
  return (
    <div className={disabled ? "opacity-40" : ""}>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Search radius</label>
        <span className="text-xs text-gray-500">{value} km</span>
      </div>
      <input
        type="range"
        min={1}
        max={25}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-500"
      />
      <div className="mt-1 flex flex-wrap gap-1.5">
        {PRESETS.map((km) => (
          <button
            key={km}
            type="button"
            disabled={disabled}
            onClick={() => onChange(km)}
            className={`rounded-full border px-2.5 py-0.5 text-xs ${
              value === km ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {km} km
          </button>
        ))}
      </div>
      {disabled && <p className="mt-1 text-xs text-gray-400">Pick a location first to search by radius.</p>}
    </div>
  );
}
