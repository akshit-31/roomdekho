import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Home, Users, CalendarClock, MessageCircle, Bell } from "lucide-react";
import { timeAgo } from "../../utils/formatDate";
import { notificationApi } from "../../services/api/notification.api";

// Maps notification.type (set by server/src/services/notification.service.js
// callers) to an icon — mirrors the examples in the product spec:
// "New room matching your criteria", "X% compatibility", "visit tomorrow".
const ICONS = {
  room_match: Home,
  roommate_match: Users,
  visit_reminder: CalendarClock,
  message: MessageCircle,
};

export default function NotificationItem({ notification, onRead }) {
  const navigate = useNavigate();
  const Icon = ICONS[notification.type] || Bell;

  const handleClick = async () => {
    if (!notification.read) {
      await notificationApi.markRead(notification._id);
      onRead?.(notification._id);
    }
    if (notification.actionUrl) navigate(notification.actionUrl);
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50",
        !notification.read && "bg-brand-50/60"
      )}
    >
      <span className={clsx("mt-0.5 rounded-full p-2", notification.read ? "bg-gray-100 text-gray-400" : "bg-brand-100 text-brand-600")}>
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <p className={clsx("text-sm", notification.read ? "text-gray-600" : "font-medium text-gray-900")}>
          {notification.title}
        </p>
        {notification.message && <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{notification.message}</p>}
        <p className="mt-1 text-[11px] text-gray-400">{timeAgo(notification.createdAt)}</p>
      </span>
      {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />}
    </button>
  );
}
