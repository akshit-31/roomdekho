import { formatCurrency } from "../../utils/formatCurrency";

export default function ExpenseSummary({ expenses = [] }) {
  const total = expenses.reduce((sum, e) => sum + (e.yourShare ?? e.amount ?? 0), 0);
  const paid = expenses.filter((e) => e.status === "paid").reduce((sum, e) => sum + (e.yourShare ?? e.amount ?? 0), 0);
  const pending = total - paid;

  const cards = [
    { label: "This month", value: total, color: "text-gray-900" },
    { label: "Paid", value: paid, color: "text-green-600" },
    { label: "Pending", value: pending, color: "text-amber-600" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-gray-100 bg-white p-4 text-center">
          <p className={`text-lg font-bold ${c.color}`}>{formatCurrency(c.value)}</p>
          <p className="mt-0.5 text-xs text-gray-500">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
