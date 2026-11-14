import clsx from "clsx";
import ImageMessage from "./ImageMessage";
import ReadReceipt from "./ReadReceipt";

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={clsx("flex my-1", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-[75%] sm:max-w-[65%] rounded-3xl px-4 py-2.5 text-xs sm:text-sm shadow-sm transition-all",
          isOwn
            ? "rounded-br-xs bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-amber-500/10"
            : "rounded-bl-xs bg-slate-100 text-slate-900 border border-slate-200/70"
        )}
      >
        {message.imageUrl && (
          <div className="mb-2 overflow-hidden rounded-2xl">
            <ImageMessage url={message.imageUrl} />
          </div>
        )}
        {message.text && (
          <p className="whitespace-pre-wrap break-words leading-relaxed select-text font-normal">
            {message.text}
          </p>
        )}

        <div
          className={clsx(
            "mt-1.5 flex items-center gap-1.5 text-[10px]",
            isOwn ? "justify-end text-white/80" : "text-slate-400"
          )}
        >
          <span>{formatTime(message.sentAt)}</span>
          {isOwn && <ReadReceipt status={message.status || "sent"} />}
        </div>
      </div>
    </div>
  );
}
