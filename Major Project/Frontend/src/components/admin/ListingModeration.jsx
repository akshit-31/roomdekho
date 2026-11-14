import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, ExternalLink } from "lucide-react";
import placeholder from "../../assets/images/placeholder-room.jpg";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import { adminApi } from "../../services/api/admin.api";

export default function ListingModeration({ listings = [], onChanged }) {
  const [loadingId, setLoadingId] = useState(null);
  const [feedback, setFeedback] = useState({});

  if (!listings.length) {
    return (
      <EmptyState
        title="Nothing to moderate"
        description="No listings match this category. New listings submitted by owners will appear here for review."
      />
    );
  }

  const act = async (id, action) => {
    setLoadingId(id);
    try {
      await adminApi.moderateListing(id, action);
      setFeedback((prev) => ({
        ...prev,
        [id]: action === "approve" ? "Approved!" : "Rejected",
      }));
      onChanged?.();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update listing status");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {listings.map((room) => {
        const isPending = room.status === "pending" || !room.status;
        const isApproved = room.status === "published" || room.status === "approved";
        const isRejected = room.status === "rejected";

        return (
          <div
            key={room._id}
            className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 transition-all hover:shadow-sm sm:flex-row sm:items-center sm:gap-4"
          >
            <img
              src={room.media?.[0]?.url || placeholder}
              alt=""
              className="h-20 w-full rounded-xl object-cover sm:h-16 sm:w-24 shrink-0"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/rooms/${room._id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="line-clamp-1 text-sm font-semibold text-gray-900 hover:text-amber-600 flex items-center gap-1"
                >
                  {room.title}
                  <ExternalLink size={13} className="text-gray-400" />
                </Link>

                {/* Status Badge */}
                {isPending && (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
                    ⏳ Pending Review
                  </span>
                )}
                {isApproved && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-bold text-green-700 border border-green-200">
                    ✓ Approved & Live
                  </span>
                )}
                {isRejected && (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-700 border border-red-200">
                    ✕ Rejected
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                <span className="font-semibold text-gray-800">
                  ₹{Number(room.rent || 0).toLocaleString()}/month
                </span>
                <span>•</span>
                <span>
                  {room.address?.city || room.city}
                  {room.address?.locality ? `, ${room.address.locality}` : ""}
                </span>
                <span>•</span>
                <span>Owner: <strong className="text-gray-700">{room.owner?.name || "Unknown"}</strong></span>
                {room.owner?.phone && (
                  <>
                    <span>•</span>
                    <span className="text-gray-400">{room.owner.phone}</span>
                  </>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex shrink-0 items-center gap-2">
              {feedback[room._id] && (
                <span className="text-xs font-semibold text-amber-600 animate-pulse">
                  {feedback[room._id]}
                </span>
              )}

              {isPending && (
                <>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={Check}
                    loading={loadingId === room._id}
                    onClick={() => act(room._id, "approve")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    icon={X}
                    loading={loadingId === room._id}
                    onClick={() => act(room._id, "reject")}
                  >
                    Reject
                  </Button>
                </>
              )}

              {isApproved && (
                <Button
                  size="sm"
                  variant="ghost"
                  icon={X}
                  loading={loadingId === room._id}
                  onClick={() => act(room._id, "reject")}
                  className="text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200 text-xs"
                >
                  Revoke / Reject
                </Button>
              )}

              {isRejected && (
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Check}
                  loading={loadingId === room._id}
                  onClick={() => act(room._id, "approve")}
                  className="text-green-700 border-green-300 hover:bg-green-50"
                >
                  Re-Approve
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
