import clsx from "clsx";

const STYLES = {
  draft: "bg-gray-100 text-gray-600",
  published: "bg-green-100 text-green-700",
  rented: "bg-amber-100 text-amber-700",
  expired: "bg-red-100 text-red-600",
};

const LABELS = {
  draft: "Draft",
  published: "Published",
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
