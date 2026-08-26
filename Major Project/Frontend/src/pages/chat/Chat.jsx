import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ConversationList from "../../components/chat/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow";
import EmptyState from "../../components/common/EmptyState";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import { chatApi } from "../../services/api/chat.api";

/**
 * Single-page chat shell: two-pane on desktop, one-pane-at-a-time on
 * mobile. Supports three entry points:
 *   /chat                              -> shows conversation list
 *   /chat/:conversationId              -> opens that thread directly
 *   /chat?roomId=..&ownerId=..         -> "Message owner" from RoomDetails
 *   /chat?userId=..                    -> "Message" from a Match/ConnectButton
 */
export default function Chat() {
  const { conversationId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileShowList, setMobileShowList] = useState(!conversationId);

  const { conversations, active, messages, typingUserId, send } = useChat(conversationId);

  // If we arrived with ?userId=.. or ?ownerId=.. instead of a conversationId,
  // try to resolve it to an existing conversation. Starting a brand-new
  // conversation from scratch needs a backend "create conversation"
  // endpoint (server/src/modules/chat) that isn't wired up yet.
  const targetUserId = searchParams.get("userId") || searchParams.get("ownerId");
  const resolvedConversation = useMemo(() => {
    if (conversationId || !targetUserId) return null;
    return conversations.find((c) => c.otherUser?._id === targetUserId) || null;
  }, [conversations, conversationId, targetUserId]);

  useEffect(() => {
    if (targetUserId && !conversationId) {
      if (resolvedConversation) {
        navigate(`/chat/${resolvedConversation._id}`, { replace: true });
      } else {
        chatApi.createConversation(targetUserId).then(({ data }) => {
          const newId = data.data?.id || data.data?._id;
          if (newId) navigate(`/chat/${newId}`, { replace: true });
        }).catch(() => {});
      }
    } else if (!conversationId && conversations.length === 0) {
      // Auto-connect both Super Admin (ID 1) and Room Owner (ID 3) into the active conversation list
      Promise.all([
        chatApi.createConversation(1), // Super Admin
        chatApi.createConversation(3), // Room Owner
      ]).then((results) => {
        const firstId = results[0]?.data?.data?.id || results[0]?.data?.data?._id;
        if (firstId) navigate(`/chat/${firstId}`, { replace: true });
      }).catch(() => {});
    }
  }, [resolvedConversation, targetUserId, conversationId, conversations.length]);

  const selectConversation = (id) => {
    navigate(`/chat/${id}`);
    setMobileShowList(false);
  };

  const showNoConversationYet = targetUserId && !conversationId && !resolvedConversation && conversations.length >= 0;

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-2xl border border-gray-100 sm:my-6 sm:h-[80vh]">
      {/* Sidebar */}
      <div className={`w-full shrink-0 overflow-y-auto border-r border-gray-100 bg-white p-3 sm:block sm:w-80 ${mobileShowList ? "block" : "hidden"}`}>
        <h1 className="mb-3 px-1 text-base font-semibold text-gray-900">Messages</h1>
        <ConversationList conversations={conversations} activeId={conversationId} onSelect={selectConversation} />
      </div>

      {/* Chat pane */}
      <div className={`flex min-w-0 flex-1 flex-col bg-white ${mobileShowList ? "hidden" : "flex"} sm:flex`}>
        {conversationId && (
          <button
            onClick={() => setMobileShowList(true)}
            className="flex items-center gap-1.5 border-b border-gray-100 px-4 py-2.5 text-sm text-gray-500 sm:hidden"
          >
            <ArrowLeft size={16} /> Back to messages
          </button>
        )}

        {showNoConversationYet ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <EmptyState
              title="Start the conversation"
              description="Send your first message from the room or profile page to begin chatting — new conversations aren't created from this screen yet."
            />
          </div>
        ) : (
          <ChatWindow
            conversation={active}
            messages={messages}
            currentUserId={user?.id}
            typingUserId={typingUserId}
            onSend={send}
          />
        )}
      </div>
    </div>
  );
}
