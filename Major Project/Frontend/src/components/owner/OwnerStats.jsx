import { Home, Eye, Mail, Users, CalendarClock, ClipboardCheck, Wallet, Star } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

/**
 * Mirrors the Owner Dashboard tree from the product spec exactly:
 * Active Listings, Views, Enquiries, Interested Users, Visits,
 * Bookings, Earnings, Reviews. `stats` comes from GET /owner/dashboard.
 */
export default function OwnerStats({ stats = {} }) {
  const cards = [
    { label: "Active Listings", value: stats.activeListings ?? 0, icon: Home },
    { label: "Views", value: stats.views ?? 0, icon: Eye },
    { label: "Enquiries", value: stats.enquiries ?? 0, icon: Mail },
    { label: "Interested Users", value: stats.interestedUsers ?? 0, icon: Users },
    { label: "Visits", value: stats.visits ?? 0, icon: CalendarClock },
    { label: "Bookings", value: stats.bookings ?? 0, icon: ClipboardCheck },
    { label: "Earnings", value: formatCurrency(stats.earnings ?? 0), icon: Wallet },
    { label: "Reviews", value: stats.avgRating ? `${stats.avgRating.toFixed(1)} ★` : "No reviews", icon: Star },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-2xl border border-gray-100 bg-white p-4">
          <span className="inline-flex rounded-xl bg-brand-50 p-2 text-brand-600">
            <Icon size={18} />
          </span>
          <p className="mt-3 text-xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      ))}
    </div>
  );
}
