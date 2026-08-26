import ReviewCard from "../reviews/ReviewCard";
import RatingSummary from "../reviews/RatingSummary";
import EmptyState from "../common/EmptyState";

export default function OwnerReviews({ reviews = [], average = 0, distribution = {} }) {
  return (
    <div className="space-y-4">
      <RatingSummary average={average} count={reviews.length} distribution={distribution} />

      {reviews.length ? (
        <div className="space-y-3">
          {reviews.map((r) => (
            <ReviewCard key={r._id} review={r} />
          ))}
        </div>
      ) : (
        <EmptyState title="No reviews yet" description="Reviews from tenants will appear here once you have completed bookings." />
      )}
    </div>
  );
}
