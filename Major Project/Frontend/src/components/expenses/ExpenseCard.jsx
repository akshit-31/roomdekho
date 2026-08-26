import { useState } from "react";
import clsx from "clsx";
import { Home, Zap, Wifi, UtensilsCrossed, Receipt, CheckCircle2 } from "lucide-react";
import Button from "../common/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { expenseApi } from "../../services/api/expense.api";

const CATEGORY_ICONS = {
  rent: Home,
  electricity: Zap,
  wifi: Wifi,
  food: UtensilsCrossed,
  other: Receipt,
};

const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  overdue: "bg-red-100 text-red-600",
};

export default function ExpenseCard({ expense, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const Icon = CATEGORY_ICONS[expense.category] || Receipt;
  const status = expense.status || "pending";

  const markPaid = async () => {
    setLoading(true);
    try {
      await expenseApi.markPaid(expense._id);
      onUpdated?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4">
      <span className="rounded-xl bg-brand-50 p-2.5 text-brand-600">
        <Icon size={18} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium capitalize text-gray-900">{expense.category}</p>
        <p className="text-xs text-gray-500">
          {expense.dueDate ? `Due ${formatDate(expense.dueDate)}` : expense.month}
          {expense.yourShare != null && ` · Your share: ${formatCurrency(expense.yourShare)}`}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
        <span className={clsx("mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium capitalize", STATUS_STYLES[status])}>
          {status}
        </span>
      </div>

      {status !== "paid" && (
        <Button size="sm" variant="secondary" icon={CheckCircle2} loading={loading} onClick={markPaid}>
          Mark paid
        </Button>
      )}
    </div>
  );
}
