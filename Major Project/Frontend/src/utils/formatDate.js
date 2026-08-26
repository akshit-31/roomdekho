import { format, formatDistanceToNow } from "date-fns";

export function formatDate(date, pattern = "dd MMM yyyy") {
  if (!date) return "-";
  return format(new Date(date), pattern);
}

export function timeAgo(date) {
  if (!date) return "-";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}
