import clsx from "clsx";
import { ShieldCheck, Building2, DoorOpen, Users } from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";
import { timeAgo } from "../../utils/formatDate";

export default function ConversationItem({ conversation, active, onClick }) {
  const other = conversation.otherUser || {};
  const isOtherAdmin = other.role === "admin";
  const isOtherOwner = other.role === "owner";

  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all",
        active
          ? "bg-amber-500/10 border border-amber-500/30 shadow-xs"
          : "hover:bg-slate-50 border border-transparent"
      )}
    >
      <div className="relative shrink-0">
        <div className={clsx(
          "rounded-full p-[2px]",
          active ? "bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500" : "bg-slate-200"
        )}>
          <img
            src={other.avatarUrl || defaultAvatar}
            alt={other.name}
            className="h-11 w-11 rounded-full object-cover border border-white"
          />
        </div>
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow-xs" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <p className="truncate text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1">
            {other.name || "User"}
            {isOtherAdmin && <ShieldCheck size={13} className="text-red-500 shrink-0" />}
            {isOtherOwner && <Building2 size={12} className="text-amber-500 shrink-0" />}
          </p>
          {(conversation.updatedAt || conversation.lastMessageAt) && (
            <span className="shrink-0 text-[10px] text-slate-400">
              {timeAgo(conversation.updatedAt || conversation.lastMessageAt)}
            </span>
          )}
        </div>

        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="truncate text-[11px] text-slate-500">
            {conversation.lastMessage || conversation.lastMessageText || "Tap to chat"}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white shadow-xs">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
