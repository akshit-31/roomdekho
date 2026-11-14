import clsx from "clsx";

const STYLES = {
  pending: "bg-amber-100 text-amber-800 border border-amber-200",
  published: "bg-green-100 text-green-700 border border-green-200",
  approved: "bg-green-100 text-green-700 border border-green-200",
  rejected: "bg-red-100 text-red-600 border border-red-200",
  draft: "bg-gray-100 text-gray-600 border border-gray-200",
  rented: "bg-blue-100 text-blue-700 border border-blue-200",
  expired: "bg-gray-200 text-gray-600",
};

const LABELS = {
  pending: "Pending Approval",
  published: "Published",
  approved: "Approved",
  rejected: "Rejected",
  draft: "Draft",
  rented: "Rented",
  expired: "Expired",
};

export default function PropertyStatus({ status = "draft", className }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STYLES[status] || STYLES.draft,
        className
      )}
    >
      {LABELS[status] || status}
    </span>
  );
}
