import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchNotifications, pushNotification, markAllReadLocal } from "../store/notification/notification.store";
import { onNotification } from "../socket/notification.socket";

export function useNotifications() {
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector((s) => s.notification);

  useEffect(() => {
    dispatch(fetchNotifications());
    const off = onNotification((n) => dispatch(pushNotification(n)));
    return off;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { items, unreadCount, markAllRead: () => dispatch(markAllReadLocal()) };
}
