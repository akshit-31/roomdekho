import defaultAvatar from "/images/default-avatar.jpg";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import OnlineStatus from "./OnlineStatus";
import EmptyState from "../common/EmptyState";
import { chatApi } from "../../services/api/chat.api";
import { uploadApi } from "../../services/api/upload.api";

/**
 * Assembles the full chat pane: header, MessageList, optional typing
 * indicator, and MessageInput. Driven by hooks/useChat(conversationId).
 */
export default function ChatWindow({
  conversation,
  messages,
  currentUserId,
  typingUserId,
  onSend,
}) {
  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <EmptyState title="Select a conversation" description="Pick someone from the list to see your messages." />
      </div>
    );
  }

  const other = conversation.otherUser || {};

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

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
        <img src={other.avatarUrl || defaultAvatar} alt={other.name} className="h-10 w-10 rounded-full object-cover" />
        <div>
          <p className="text-sm font-semibold text-gray-900">{other.name}</p>
          <OnlineStatus userId={other._id} showLabel />
        </div>
      </div>

      <MessageList messages={messages} currentUserId={currentUserId} />

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
