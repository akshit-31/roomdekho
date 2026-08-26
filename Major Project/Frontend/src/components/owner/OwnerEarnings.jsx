import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatCurrency } from "../../utils/formatCurrency";

export default function OwnerEarnings({ earnings }) {
  const { total = 0, monthly = [] } = earnings || {};

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <p className="text-xs text-gray-500">Total earnings</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
      </div>

      {monthly.length > 0 && (
        <div className="h-64 rounded-2xl border border-gray-100 bg-white p-5">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="amount" fill="#2f7ef0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
