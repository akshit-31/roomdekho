import EmptyState from "../common/EmptyState";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

const STATUS_STYLES = {
  success: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-600",
  refunded: "bg-gray-100 text-gray-600",
};

/**
 * Platform-wide transaction log for the admin. Sourced from Razorpay
 * order/payment records persisted by server/src/services/payment.service.js.
 */
export default function PaymentTable({ payments = [] }) {
  if (!payments.length) return <EmptyState title="No transactions yet" />;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
            <th className="px-4 py-3 font-medium">Transaction</th>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.orderId}</td>
              <td className="px-4 py-3 text-gray-900">{p.user?.name}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(p.amount)}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[p.status] || STATUS_STYLES.pending}`}>
                  {p.status}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500">{formatDate(p.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
