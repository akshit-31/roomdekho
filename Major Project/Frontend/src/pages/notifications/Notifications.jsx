import { CheckCheck } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import NotificationList from "../../components/notifications/NotificationList";
import Button from "../../components/common/Button";
import { useNotifications } from "../../hooks/useNotifications";

/**
 * Full-page version of the NotificationBell dropdown — same
 * useNotifications() hook (GET /notifications + "notification:new"
 * socket event), just without the 8-item cap.
 */
export default function Notifications() {
  const { items, unreadCount, markAllRead } = useNotifications();

  return (
    <PageContainer
      title="Notifications"
      subtitle={unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
      action={
        unreadCount > 0 && (
          <Button variant="secondary" icon={CheckCheck} onClick={markAllRead}>
            Mark all read
          </Button>
        )
      }
    >
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <NotificationList notifications={items} />
      </div>
    </PageContainer>
  );
}
