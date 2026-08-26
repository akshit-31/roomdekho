import Input from "../common/Input";

export default function RentRange({ min, max, onChange }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">Monthly rent (₹)</label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Min"
          value={min || ""}
          onChange={(e) => onChange({ rentMin: e.target.value, rentMax: max })}
        />
        <span className="text-gray-400">–</span>
        <Input
          type="number"
          placeholder="Max"
          value={max || ""}
          onChange={(e) => onChange({ rentMin: min, rentMax: e.target.value })}
        />
      </div>
    </div>
  );
}
