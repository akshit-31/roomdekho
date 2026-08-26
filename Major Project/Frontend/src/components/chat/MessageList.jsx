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
      {messages.map((m) => (
        <MessageBubble
          key={m._id || m.sentAt}
          message={m}
          isOwn={String(m.senderId || m.sender?._id) === String(currentUserId)}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
