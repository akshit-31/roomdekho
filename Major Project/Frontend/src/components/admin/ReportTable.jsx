import EmptyState from "../common/EmptyState";
import { timeAgo } from "../../utils/formatDate";
import Button from "../common/Button";

const TYPE_LABELS = { user: "Reported user", listing: "Reported listing", review: "Reported review", message: "Reported message" };

export default function ReportTable({ reports = [], onInvestigate }) {
  if (!reports.length) return <EmptyState title="No open reports" description="Great — nothing needs your attention right now." />;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Reported by</th>
            <th className="px-4 py-3 font-medium">Reason</th>
            <th className="px-4 py-3 font-medium">Filed</th>
            <th className="px-4 py-3 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r._id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3 text-gray-900">{TYPE_LABELS[r.targetType] || r.targetType}</td>
              <td className="px-4 py-3 text-gray-600">{r.reportedBy?.name}</td>
              <td className="px-4 py-3 line-clamp-1 max-w-[240px] text-gray-600">{r.reason}</td>
              <td className="px-4 py-3 text-xs text-gray-400">{timeAgo(r.createdAt)}</td>
              <td className="px-4 py-3">
                <Button size="sm" variant="secondary" onClick={() => onInvestigate?.(r)}>Investigate</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
