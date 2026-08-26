import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency } from "../../utils/formatCurrency";

const COLORS = ["#2f7ef0", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444"];

export default function ExpenseChart({ expenses = [] }) {
  const byCategory = expenses.reduce((acc, e) => {
    const key = e.category || "other";
    acc[key] = (acc[key] || 0) + (e.yourShare ?? e.amount ?? 0);
    return acc;
  }, {});

  const data = Object.entries(byCategory).map(([name, value]) => ({ name, value }));
  if (!data.length) return null;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, textTransform: "capitalize" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
