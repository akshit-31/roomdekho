import { useState } from "react";
import { ShieldCheck, Flag } from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";
import RatingStars from "./RatingStars";
import { timeAgo } from "../../utils/formatDate";
import { reviewApi } from "../../services/api/review.api";

export default function ReviewCard({ review }) {
  const [reported, setReported] = useState(false);
  const author = review.author || {};

  const handleReport = async () => {
    if (reported) return;
    await reviewApi.report(review._id);
    setReported(true);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={author.avatarUrl || defaultAvatar} alt={author.name} className="h-10 w-10 rounded-full object-cover" />
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900">
              {author.name}
              {review.verified && <ShieldCheck size={13} className="text-brand-500" />}
            </p>
            <div className="flex items-center gap-2">
              <RatingStars value={review.rating} readOnly size="sm" />
              <span className="text-xs text-gray-400">{timeAgo(review.createdAt)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleReport}
          disabled={reported}
          title={reported ? "Reported" : "Report this review"}
          className="rounded-lg p-1.5 text-gray-300 hover:bg-gray-50 hover:text-red-500 disabled:text-red-400"
        >
          <Flag size={15} />
        </button>
      </div>

      {review.comment && <p className="mt-3 text-sm text-gray-700">{review.comment}</p>}
    </div>
  );
}
