import clsx from "clsx";

const STYLES = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  completed: "bg-gray-100 text-gray-600",
};

const LABELS = {
  pending: "Pending approval",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

/**
 * Mirrors server/src/constants/status.js BOOKING_STATUS enum.
 */
export default function BookingStatus({ status = "pending", className }) {
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", STYLES[status] || STYLES.pending, className)}>
      {LABELS[status] || status}
    </span>
  );
}
