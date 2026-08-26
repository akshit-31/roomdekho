import clsx from "clsx";
import defaultAvatar from "/images/default-avatar.jpg";
import OnlineStatus from "./OnlineStatus";
import { timeAgo } from "../../utils/formatDate";

export default function ConversationItem({ conversation, active, onClick }) {
  const other = conversation.otherUser || {};

  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
        active ? "bg-brand-50" : "hover:bg-gray-50"
      )}
    >
      <div className="relative shrink-0">
        <img src={other.avatarUrl || defaultAvatar} alt={other.name} className="h-11 w-11 rounded-full object-cover" />
        <span className="absolute -bottom-0.5 -right-0.5">
          <OnlineStatus userId={other._id} />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate text-sm font-medium text-gray-900">{other.name}</p>
          {conversation.lastMessageAt && (
            <span className="shrink-0 text-[11px] text-gray-400">{timeAgo(conversation.lastMessageAt)}</span>
          )}
        </div>
        <p className="truncate text-xs text-gray-500">{conversation.lastMessageText || "Start the conversation"}</p>
      </div>

      {conversation.unreadCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-semibold text-white">
          {conversation.unreadCount}
        </span>
      )}
    </button>
  );
}
