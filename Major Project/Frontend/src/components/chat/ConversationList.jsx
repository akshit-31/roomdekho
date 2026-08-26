import ConversationItem from "./ConversationItem";
import EmptyState from "../common/EmptyState";

export default function ConversationList({ conversations = [], activeId, onSelect }) {
  if (!conversations.length) {
    return <EmptyState title="No conversations yet" description="Message a room owner or a roommate match to start chatting." />;
  }

  return (
    <div className="space-y-1">
      {conversations.map((c) => (
        <ConversationItem
          key={c._id}
          conversation={c}
          active={c._id === activeId}
          onClick={() => onSelect(c._id)}
        />
      ))}
    </div>
  );
}
