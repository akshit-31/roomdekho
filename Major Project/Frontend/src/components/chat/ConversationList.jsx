import ConversationItem from "./ConversationItem";
import EmptyState from "../common/EmptyState";

export default function ConversationList({ conversations = [], activeId, onSelect }) {
  if (!conversations.length) {
    return <EmptyState title="No conversations yet" description="Message a room owner or a roommate match to start chatting." />;
  }

  return (
    <div className="space-y-1">
      {conversations.map((c) => {
        const cId = String(c._id || c.id);
        return (
          <ConversationItem
            key={cId}
            conversation={c}
            active={cId === String(activeId)}
            onClick={() => onSelect(cId)}
          />
        );
      })}
    </div>
  );
}
