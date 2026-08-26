import NotificationItem from "./NotificationItem";
import EmptyState from "../common/EmptyState";

export default function NotificationList({ notifications = [], onRead }) {
  if (!notifications.length) {
    return <EmptyState title="You're all caught up" description="New matches, messages, and reminders will show up here." />;
  }

  return (
    <div className="divide-y divide-gray-50">
      {notifications.map((n) => (
        <NotificationItem key={n._id} notification={n} onRead={onRead} />
      ))}
    </div>
  );
}
