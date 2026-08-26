import { useState } from "react";
import RatingStars from "../reviews/RatingStars";
import Button from "../common/Button";
import EmptyState from "../common/EmptyState";
import { api } from "../../services/api/axios";

/**
 * Reported/flagged reviews queue. Backend endpoints to be added:
 * PATCH /admin/reviews/:id/approve, PATCH /admin/reviews/:id/remove
 */
export default function ReviewModeration({ reviews = [], onChanged }) {
  const [loadingId, setLoadingId] = useState(null);

  if (!reviews.length) return <EmptyState title="No reviews to moderate" description="Reported reviews will show up here for approval or removal." />;

  const act = async (id, action) => {
    setLoadingId(id);
    try {
      await api.patch(`/admin/reviews/${id}/${action}`);
      onChanged?.();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r._id} className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">{r.author?.name}</p>
            <RatingStars value={r.rating} readOnly size="sm" />
          </div>
          <p className="mt-2 text-sm text-gray-600">{r.comment}</p>
          <p className="mt-1 text-xs text-red-500">{r.reportCount} report{r.reportCount === 1 ? "" : "s"}</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="secondary" loading={loadingId === r._id} onClick={() => act(r._id, "approve")}>Keep review</Button>
            <Button size="sm" variant="danger" loading={loadingId === r._id} onClick={() => act(r._id, "remove")}>Remove review</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
