import { useState } from "react";
import { Plus, X } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { expenseApi } from "../../services/api/expense.api";

/**
 * Splits a shared cost (electricity, wifi, food, rent) between roommates —
 * equally by default, or by custom share percentages. Submits via
 * POST /expenses/split (server/src/modules/expenses).
 */
export default function ExpenseSplitter({ conversationId, onSplit }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("electricity");
  const [mode, setMode] = useState("equal");
  const [people, setPeople] = useState([{ name: "", share: "" }, { name: "", share: "" }]);
  const [submitting, setSubmitting] = useState(false);

  const addPerson = () => setPeople([...people, { name: "", share: "" }]);
  const removePerson = (i) => setPeople(people.filter((_, idx) => idx !== i));
  const updatePerson = (i, field, value) => {
    const next = [...people];
    next[i][field] = value;
    setPeople(next);
  };

  const equalShare = amount && people.length ? Number(amount) / people.length : 0;
  const customTotal = people.reduce((sum, p) => sum + (Number(p.share) || 0), 0);

  const submit = async () => {
    setSubmitting(true);
    try {
      const shares =
        mode === "equal"
          ? people.map((p) => ({ name: p.name, amount: equalShare }))
          : people.map((p) => ({ name: p.name, amount: Number(p.share) || 0 }));

      await expenseApi.split({ category, amount: Number(amount), mode, shares });
      onSplit?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900">Split an expense</h2>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Total amount (₹)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="rent">Rent</option>
            <option value="electricity">Electricity</option>
            <option value="wifi">WiFi</option>
            <option value="food">Food</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        {["equal", "custom"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
              mode === m ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-500"
            }`}
          >
            {m} split
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {people.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input placeholder="Roommate name" value={p.name} onChange={(e) => updatePerson(i, "name", e.target.value)} className="flex-1" />
            {mode === "custom" ? (
              <Input
                type="number"
                placeholder="₹ share"
                value={p.share}
                onChange={(e) => updatePerson(i, "share", e.target.value)}
                className="w-28"
              />
            ) : (
              <span className="w-28 text-right text-sm text-gray-500">{formatCurrency(equalShare)}</span>
            )}
            {people.length > 2 && (
              <button onClick={() => removePerson(i)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Remove person">
                <X size={16} />
              </button>
            )}
          </div>
        ))}
        <button onClick={addPerson} className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline">
          <Plus size={15} /> Add roommate
        </button>
      </div>

      {mode === "custom" && amount && customTotal !== Number(amount) && (
        <p className="text-xs text-amber-600">
          Shares add up to {formatCurrency(customTotal)}, but total is {formatCurrency(amount)}.
        </p>
      )}

      <Button className="w-full" onClick={submit} loading={submitting} disabled={!amount}>
        Save split
      </Button>
    </div>
  );
}
