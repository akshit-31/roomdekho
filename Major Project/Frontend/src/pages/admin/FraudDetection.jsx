import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Copy, Activity, AlertTriangle } from "lucide-react";
import FraudAlerts from "../../components/admin/FraudAlerts";
import Loader from "../../components/common/Loader";
import { adminApi } from "../../services/api/admin.api";

const FILTERS = [
  { key: "all", label: "All signals" },
  { key: "high", label: "High severity" },
  { key: "duplicate_listing", label: "Duplicate listings" },
  { key: "suspicious_activity", label: "Suspicious activity" },
  { key: "scam", label: "Scam text" },
];

export default function FraudDetection() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const load = () => {
    setLoading(true);
    adminApi
      .fraudAlerts()
      .then(({ data }) => setAlerts(data.data || []))
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const counts = useMemo(() => {
    const bySeverity = { high: 0, medium: 0, low: 0 };
    alerts.forEach((a) => { bySeverity[a.severity || "medium"] += 1; });
    return bySeverity;
  }, [alerts]);

  const visibleAlerts = useMemo(() => {
    if (filter === "all") return alerts;
    if (filter === "high") return alerts.filter((a) => a.severity === "high");
    return alerts.filter((a) => a.type === filter);
  }, [alerts, filter]);

  const handleResolve = async (alert) => {
    // Optimistic — the record disappears immediately, and we roll back if the request fails.
    setAlerts((prev) => prev.filter((a) => a._id !== alert._id));
    try {
      await adminApi.resolveFraudAlert(alert._id);
    } catch {
      setAlerts((prev) => [alert, ...prev]);
    }
  };

  const handleViewTarget = (alert) => {
    if (alert.targetType === "listing") navigate(`/rooms/${alert.targetId}`);
    else if (alert.targetType === "user") navigate(`/admin/users?highlight=${alert.targetId}`);
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Fraud &amp; scam detection</h1>
          <p className="text-sm text-gray-500">Automated signals flagged for review — duplicate listings, unusual activity, and scam-pattern text.</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard icon={ShieldAlert} tone="red" label="High severity" value={counts.high} />
        <SummaryCard icon={AlertTriangle} tone="amber" label="Medium severity" value={counts.medium} />
        <SummaryCard icon={Activity} tone="gray" label="Low severity" value={counts.low} />
        <SummaryCard icon={Copy} tone="blue" label="Total open signals" value={alerts.length} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              filter === f.key
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <FraudAlerts alerts={visibleAlerts} onResolve={handleResolve} onViewTarget={handleViewTarget} />
      )}
    </div>
  );
}

const TONE_CLASSES = {
  red: "bg-red-50 text-red-600",
  amber: "bg-amber-50 text-amber-600",
  gray: "bg-gray-100 text-gray-500",
  blue: "bg-brand-50 text-brand-600",
};

function SummaryCard({ icon: Icon, tone, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <span className={`inline-flex rounded-xl p-2 ${TONE_CLASSES[tone]}`}>
        <Icon size={16} />
      </span>
      <p className="mt-2 text-lg font-bold text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-500">{label}</p>
    </div>
  );
}
