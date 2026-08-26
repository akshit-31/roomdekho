import { useEffect, useState } from "react";
import clsx from "clsx";
import { onPresenceUpdate } from "../../socket/presence.socket";

/**
 * Subscribes to the "presence:update" event emitted by
 * server/src/sockets/presence.socket.js (a full online-user-id array
 * broadcast on every connect/disconnect) and renders a dot for one user.
 */
export default function OnlineStatus({ userId, showLabel = false }) {
  const [onlineIds, setOnlineIds] = useState([]);

  useEffect(() => {
    const off = onPresenceUpdate((ids) => setOnlineIds(ids || []));
    return off;
  }, []);

  const isOnline = onlineIds.includes(userId);

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={clsx(
          "h-2.5 w-2.5 rounded-full ring-2 ring-white",
          isOnline ? "bg-green-500" : "bg-gray-300"
        )}
        aria-label={isOnline ? "Online" : "Offline"}
      />
      {showLabel && <span className="text-xs text-gray-500">{isOnline ? "Online" : "Offline"}</span>}
    </span>
  );
}
