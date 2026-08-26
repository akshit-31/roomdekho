import { Link } from "react-router-dom";
import defaultAvatar from "/images/default-avatar.jpg";
import EmptyState from "../common/EmptyState";

/**
 * Seekers/roommates who favorited or repeatedly viewed one of the
 * owner's listings — a softer signal than a full enquiry message.
 */
export default function InterestedUsers({ users = [], roomTitle }) {
  if (!users.length) {
    return <EmptyState title="No interested users yet" description={roomTitle ? `No one has shown interest in "${roomTitle}" yet.` : "Interest signals will appear here."} />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {users.map((u) => (
        <Link
          key={u._id}
          to={`/roommates/${u._id}`}
          className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-center hover:shadow-sm"
        >
          <img src={u.avatarUrl || defaultAvatar} alt={u.name} className="h-14 w-14 rounded-full object-cover" />
          <p className="line-clamp-1 text-xs font-medium text-gray-900">{u.name}</p>
        </Link>
      ))}
    </div>
  );
}
