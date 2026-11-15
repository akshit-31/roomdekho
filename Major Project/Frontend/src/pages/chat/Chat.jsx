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
  const { user, isAuthenticated } = useAuth();
  const [mobileShowList, setMobileShowList] = useState(!conversationId);

  // Require authentication to access Chat
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/chat" } }, replace: true });
    }
  }, [isAuthenticated, navigate]);

  const { conversations, active, messages, typingUserId, send } = useChat(conversationId);

  const targetUserId = searchParams.get("userId") || searchParams.get("ownerId");
  const isSupportAdmin = searchParams.get("support") === "admin";

  const resolvedConversation = useMemo(() => {
    if (conversationId || !targetUserId) return null;
    return (
      conversations.find(
        (c) =>
          String(c.otherUser?._id) === String(targetUserId) ||
          String(c.otherUser?.id) === String(targetUserId) ||
          String(c.other_user_id) === String(targetUserId)
      ) || null
    );
  }, [conversations, conversationId, targetUserId]);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (isSupportAdmin && !conversationId) {
      chatApi
        .createAdminConversation()
        .then(({ data }) => {
          const adminConvId = data.data?._id || data.data?.id;
          if (adminConvId) navigate(`/chat/${adminConvId}`, { replace: true });
        })
        .catch(() => {});
      return;
    }

    if (targetUserId && !conversationId) {
      if (resolvedConversation) {
        navigate(`/chat/${resolvedConversation._id || resolvedConversation.id}`, { replace: true });
      } else {
        chatApi
          .createConversation(targetUserId)
          .then(({ data }) => {
            const newId = data.data?.id || data.data?._id;
            if (newId) navigate(`/chat/${newId}`, { replace: true });
          })
          .catch(() => {});
      }
    } else if (!conversationId && conversations.length > 0 && window.innerWidth >= 768) {
      // On desktop, auto-select the first conversation if none selected
      const firstId = conversations[0]?._id || conversations[0]?.id;
      if (firstId) {
        navigate(`/chat/${firstId}`, { replace: true });
      }
    }
  }, [resolvedConversation, targetUserId, conversationId, conversations, isSupportAdmin, isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const selectConversation = (id) => {
    navigate(`/chat/${id}`);
    setMobileShowList(false);
  };

  const showNoConversationYet = targetUserId && !conversationId && !resolvedConversation && conversations.length >= 0;

  return (
    <div className="mx-auto flex h-[calc(100vh-4.5rem)] max-w-[1700px] w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl sm:my-6 sm:h-[84vh] shadow-2xl text-white">
      {/* Sidebar */}
      <div className={`w-full shrink-0 overflow-y-auto border-r border-white/10 bg-slate-950/60 p-3 sm:block sm:w-80 md:w-96 ${mobileShowList ? "block" : "hidden"}`}>
        <h1 className="mb-3 px-1 text-base font-black text-white">Messages</h1>
        <ConversationList conversations={conversations} activeId={conversationId} onSelect={selectConversation} />
      </div>

      {/* Chat pane */}
      <div className={`flex min-w-0 flex-1 flex-col bg-slate-900/90 ${mobileShowList ? "hidden" : "flex"} sm:flex`}>
        {conversationId && (
          <button
            onClick={() => setMobileShowList(true)}
            className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:text-white sm:hidden"
          >
            <ArrowLeft size={16} /> Back to messages
          </button>
        )}

        {showNoConversationYet ? (
          <div className="flex flex-1 items-center justify-center p-6 text-slate-300">
            <EmptyState
              title="Start the conversation"
              description="Send your first message from the room or profile page to begin chatting — new conversations aren't created from this screen yet."
            />
          </div>
        ) : (
          <ChatWindow
            conversation={active}
            messages={messages}
            currentUserId={user?.id || user?._id}
            typingUserId={typingUserId}
            onSend={send}
          />
        )}
      </div>
    </div>
  );
}
