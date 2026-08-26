import { useState } from "react";
import { Link } from "react-router-dom";
import placeholder from "../../assets/images/placeholder-room.jpg";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import { adminApi } from "../../services/api/admin.api";

export default function ListingModeration({ listings = [], onChanged }) {
  const [loadingId, setLoadingId] = useState(null);

  if (!listings.length) return <EmptyState title="Nothing to moderate" description="Flagged or newly published listings will show up here for review." />;

  const act = async (id, action) => {
    setLoadingId(id);
    try {
      await adminApi.moderateListing(id, action);
      onChanged?.();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {listings.map((room) => (
        <div key={room._id} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4">
          <img src={room.media?.[0]?.url || placeholder} alt="" className="h-14 w-20 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <Link to={`/rooms/${room._id}`} className="line-clamp-1 text-sm font-medium text-gray-900 hover:underline">
              {room.title}
            </Link>
            <p className="text-xs text-gray-500">{room.address?.city} · Owner: {room.owner?.name}</p>
            {room.isFlagged && <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-600">Flagged</span>}
          </div>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" variant="secondary" loading={loadingId === room._id} onClick={() => act(room._id, "approve")}>Approve</Button>
            <Button size="sm" variant="danger" loading={loadingId === room._id} onClick={() => act(room._id, "reject")}>Reject</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
