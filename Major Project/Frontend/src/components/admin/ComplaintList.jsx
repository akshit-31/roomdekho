import EmptyState from "../common/EmptyState";
import { timeAgo } from "../../utils/formatDate";

const STATUS_STYLES = {
  open: "bg-amber-100 text-amber-700",
  in_review: "bg-blue-100 text-blue-600",
  resolved: "bg-green-100 text-green-700",
};

/**
 * General user complaints (distinct from structured Report documents) —
 * e.g. support-desk style tickets raised through /help or in-app.
 */
export default function ComplaintList({ complaints = [] }) {
  if (!complaints.length) return <EmptyState title="No complaints" description="User-submitted complaints will appear here." />;

  return (
    <div className="space-y-2">
      {complaints.map((c) => (
        <div key={c._id} className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{c.subject}</p>
              <p className="mt-0.5 text-xs text-gray-500">From {c.user?.name} · {timeAgo(c.createdAt)}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLES[c.status] || STATUS_STYLES.open}`}>
              {(c.status || "open").replace("_", " ")}
            </span>
          </div>
          {c.description && <p className="mt-2 text-sm text-gray-600">{c.description}</p>}
        </div>
      ))}
    </div>
  );
}
