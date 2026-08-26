import { Users, Home, ShieldAlert, Flag, IndianRupee, TrendingUp } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

/**
 * `stats` comes from GET /analytics/overview (adminApi.analytics()) —
 * see feature spec §17 Analytics for the source metrics.
 */
export default function AdminStats({ stats = {} }) {
  const cards = [
    { label: "Total users", value: stats.usersTotal ?? stats.totalUsers ?? 0, icon: Users },
    { label: "Active listings", value: stats.activeListings ?? 0, icon: Home },
    { label: "Pending KYC", value: stats.pendingKyc ?? 0, icon: ShieldAlert },
    { label: "Open reports", value: stats.openReports ?? 0, icon: Flag },
    { label: "Platform revenue", value: formatCurrency(stats.revenue ?? 0), icon: IndianRupee },
    { label: "Booking conversion", value: `${stats.conversion ?? stats.bookingConversion ?? 0}%`, icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-2xl border border-gray-100 bg-white p-4">
          <span className="inline-flex rounded-xl bg-brand-50 p-2 text-brand-600"><Icon size={16} /></span>
          <p className="mt-2 text-lg font-bold text-gray-900">{value}</p>
          <p className="text-[11px] text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
