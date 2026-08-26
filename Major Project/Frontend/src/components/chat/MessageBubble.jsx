import clsx from "clsx";
import ImageMessage from "./ImageMessage";
import ReadReceipt from "./ReadReceipt";

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={clsx("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={clsx(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
          isOwn ? "rounded-br-sm bg-brand-500 text-white" : "rounded-bl-sm bg-gray-100 text-gray-900"
        )}
      >
        {message.imageUrl && <ImageMessage url={message.imageUrl} />}
        {message.text && <p className="whitespace-pre-wrap break-words">{message.text}</p>}

        <div className={clsx("mt-1 flex items-center gap-1 text-[11px]", isOwn ? "justify-end text-white/70" : "text-gray-400")}>
          {formatTime(message.sentAt)}
          {isOwn && <ReadReceipt status={message.status || "sent"} />}
        </div>
      </div>
    </div>
  );
}
