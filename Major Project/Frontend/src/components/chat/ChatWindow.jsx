import { useState } from "react";
import {
  ShieldCheck,
  Building2,
  DoorOpen,
  Users,
  Phone,
  Info,
  Sparkles,
  HelpCircle,
  CalendarDays,
  ExternalLink
} from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import OnlineStatus from "./OnlineStatus";
import EmptyState from "../common/EmptyState";
import { uploadApi } from "../../services/api/upload.api";

const QUICK_CHIPS = {
  admin: [
    "🛡️ Need help with verification & approval",
    "🏠 How to boost my listing views?",
    "💬 Question regarding platform safety"
  ],
  owner: [
    "🏠 Is this room still available?",
    "📅 Can I schedule a visit this weekend?",
    "💰 What is the exact security deposit?",
    "📍 Could you share the nearest metro landmark?"
  ],
  seeker: [
    "✅ Yes, the room is currently available!",
    "🤝 When would you like to visit and inspect?",
    "📞 We can connect over a quick phone call.",
    "📋 Please share your move-in date."
  ]
};

export default function ChatWindow({
  conversation,
  messages,
  currentUserId,
  typingUserId,
  onSend,
}) {
  const [showInfo, setShowInfo] = useState(false);

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center">
        <EmptyState
          title="Select a conversation"
          description="Pick a chat from the left panel to message room owners, seekers or contact Admin Support."
        />
      </div>
    );
  }

  const other = conversation.otherUser || {};
  const isOtherAdmin = other.role === "admin";
  const isOtherOwner = other.role === "owner";
  const isOtherSeeker = other.role === "seeker" || other.role === "roommate";

  const chips = isOtherAdmin
    ? QUICK_CHIPS.admin
    : isOtherOwner
    ? QUICK_CHIPS.owner
    : QUICK_CHIPS.seeker;

  const handleSendImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("files", file);
      const { data: uploadRes } = await uploadApi.uploadFiles(formData);
      const url = uploadRes.data?.url || uploadRes.data?.urls?.[0];
      if (url) {
        await onSend("", url);
      }
    } catch (err) {
      console.error("Chat image send failed:", err);
    }
  };

  const handleChipClick = (text) => {
    onSend(text);
  };

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col bg-white">
      {/* Instagram-Style DM Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          {/* Instagram Avatar with Gradient Ring */}
          <div className="relative shrink-0">
            <div className="rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-[2px]">
              <img
                src={other.avatarUrl || defaultAvatar}
                alt={other.name}
                className="h-10 w-10 rounded-full object-cover border-2 border-white"
              />
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-bold text-slate-900">{other.name || "User"}</p>
              {isOtherAdmin ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-200">
                  <ShieldCheck size={12} /> Admin Support
                </span>
              ) : isOtherOwner ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                  <Building2 size={11} /> Room Owner
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                  <DoorOpen size={11} /> Seeker
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-600 font-medium">Active now</span>
              {other.email && <span className="hidden sm:inline text-slate-300">· {other.email}</span>}
            </div>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className={`rounded-full p-2 transition-all hover:bg-slate-100 hover:text-slate-700 ${
              showInfo ? "bg-amber-50 text-amber-600" : ""
            }`}
            title="Chat info"
          >
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Slide-down Info Drawer (Instagram style) */}
      {showInfo && (
        <div className="border-b border-slate-100 bg-slate-50/80 p-3.5 text-xs text-slate-600 animate-fade-in flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="font-bold text-slate-800">
              {isOtherAdmin ? "Official Platform Help Desk" : other.name}
            </p>
            <p className="text-[11px] text-slate-500">
              {isOtherAdmin
                ? "Direct contact with RoomDekho operations & compliance team."
                : `Registered ${other.role === "owner" ? "Property Host" : "Seeker"} on RoomDekho.`}
            </p>
          </div>
          <button
            onClick={() => setShowInfo(false)}
            className="text-[11px] font-bold text-amber-600 hover:underline"
          >
            Close
          </button>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <MessageList messages={messages} currentUserId={currentUserId} />
      </div>

      {/* Quick Suggestion Chips (Instagram Icebreakers) */}
      {chips && chips.length > 0 && (
        <div className="border-t border-slate-50 bg-slate-50/40 px-3 py-1.5 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
          <Sparkles size={13} className="text-amber-500 shrink-0 ml-1" />
          {chips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="shrink-0 rounded-full border border-slate-200/90 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 shadow-2xs hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 transition-all active:scale-95"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {typingUserId && typingUserId !== currentUserId && <TypingIndicator name={other.name} />}

      <MessageInput
        conversationId={conversation._id}
        currentUserId={currentUserId}
        onSend={onSend}
        onSendImage={handleSendImage}
      />
    </div>
  );
}
