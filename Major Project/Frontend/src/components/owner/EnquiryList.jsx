import { Link } from "react-router-dom";
import defaultAvatar from "/images/default-avatar.jpg";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import { timeAgo } from "../../utils/formatDate";

/**
 * An "enquiry" is the first inbound chat message a seeker sends about a
 * listing — sourced from GET /owner/enquiries (server aggregates the
 * chat module's conversations started against the owner's rooms).
 */
export default function EnquiryList({ enquiries = [] }) {
  if (!enquiries.length) {
    return <EmptyState title="No enquiries yet" description="When someone messages you about a listing, it'll show up here." />;
  }

  return (
    <div className="space-y-2">
      {enquiries.map((e) => (
        <div key={e._id} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
          <img src={e.seeker?.avatarUrl || defaultAvatar} alt={e.seeker?.name} className="h-11 w-11 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">{e.seeker?.name}</p>
            <p className="line-clamp-1 text-xs text-gray-500">
              {e.room?.title} · {e.message}
            </p>
          </div>
          <span className="shrink-0 text-xs text-gray-400">{timeAgo(e.createdAt)}</span>
          <Link to={`/chat/${e.conversationId}`}>
            <Button size="sm" variant="secondary">Reply</Button>
          </Link>
        </div>
      ))}
    </div>
  );
}
