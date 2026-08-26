import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, DoorOpen, MessageSquareWarning, MessageCircle } from "lucide-react";
import AdminStats from "../../components/admin/AdminStats";
import Loader from "../../components/common/Loader";
import { adminApi } from "../../services/api/admin.api";

const SHORTCUTS = [
  { to: "/admin/users", label: "User Management", icon: Users },
  { to: "/admin/listings", label: "Room Details", icon: DoorOpen },
  { to: "/admin/complaints", label: "Complaint Management", icon: MessageSquareWarning },
  { to: "/chat", label: "Chat Management", icon: MessageCircle },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.analytics()
      .then(({ data }) => setStats(data.data || {}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading admin overview..." />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Admin overview</h1>
        <p className="text-sm text-gray-500">Platform health at a glance</p>
      </div>

      <AdminStats stats={stats} />

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SHORTCUTS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-center hover:shadow-sm"
          >
            <Icon size={20} className="text-brand-500" />
            <span className="text-xs font-medium text-gray-700">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
