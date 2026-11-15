import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import EmptyState from "../common/EmptyState";

export default function MessageList({ messages = [], currentUserId }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState title="No messages yet" description="Say hello and start the conversation." />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
      {messages.map((m, idx) => (
        <MessageBubble
          key={m._id || m.id || `${m.sentAt || ""}_${idx}`}
          message={m}
          isOwn={
            Boolean(currentUserId) &&
            String(m.senderId || m.sender_id || m.sender?._id || m.sender?.id || "") ===
              String(currentUserId)
          }
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
