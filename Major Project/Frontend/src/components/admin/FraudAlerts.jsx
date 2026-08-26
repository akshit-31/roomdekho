import { AlertTriangle, Copy, Activity, ShieldAlert, ExternalLink } from "lucide-react";
import EmptyState from "../common/EmptyState";
import { timeAgo } from "../../utils/formatDate";

const ICONS = {
  duplicate_listing: Copy,
  suspicious_activity: Activity,
  scam: AlertTriangle,
  fake_profile: ShieldAlert,
};

const LABELS = {
  duplicate_listing: "Possible duplicate listing",
  suspicious_activity: "Suspicious activity",
  scam: "Possible scam listing",
  fake_profile: "Possible fake profile",
};

// Falls back to "medium" for older records that predate the severity field.
const SEVERITY_STYLES = {
  high: { badge: "bg-red-100 text-red-700", card: "border-red-100 bg-red-50", icon: "text-red-600" },
  medium: { badge: "bg-amber-100 text-amber-700", card: "border-amber-100 bg-amber-50", icon: "text-amber-600" },
  low: { badge: "bg-gray-100 text-gray-600", card: "border-gray-200 bg-gray-50", icon: "text-gray-500" },
};

/**
 * Automated fraud signals (duplicate listings, unusual login/posting
 * velocity, scam-pattern text) — see feature spec §6 Trust & Safety.
 */
export default function FraudAlerts({ alerts = [], onResolve, onViewTarget }) {
  if (!alerts.length) {
    return <EmptyState title="No fraud signals detected" description="The system is not currently flagging anything unusual." />;
  }

  return (
    <div className="space-y-2">
      {alerts.map((a) => {
        const Icon = ICONS[a.type] || AlertTriangle;
        const severity = SEVERITY_STYLES[a.severity] || SEVERITY_STYLES.medium;

        return (
          <div key={a._id} className={`flex items-start gap-3 rounded-2xl border p-4 ${severity.card}`}>
            <Icon size={18} className={`mt-0.5 shrink-0 ${severity.icon}`} />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-gray-900">{LABELS[a.type] || a.type}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${severity.badge}`}>
                  {a.severity || "medium"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-gray-600">{a.description}</p>
              <p className="mt-1 text-[11px] text-gray-400">{timeAgo(a.createdAt)}</p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
              {a.targetId && (
                <button
                  type="button"
                  onClick={() => onViewTarget?.(a)}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-600 hover:bg-white"
                >
                  View <ExternalLink size={12} />
                </button>
              )}
              <button
                type="button"
                onClick={() => onResolve?.(a)}
                className="rounded-lg px-2 py-1 text-xs font-medium text-brand-600 hover:bg-white"
              >
                Mark resolved
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
