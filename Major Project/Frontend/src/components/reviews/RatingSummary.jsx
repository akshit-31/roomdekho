import RatingStars from "./RatingStars";

/**
 * Aggregate rating block — `distribution` is an object like
 * { 5: 32, 4: 10, 3: 3, 2: 1, 1: 0 } (counts per star), matching what
 * the backend review module can precompute alongside ratingAvg/ratingCount.
 */
export default function RatingSummary({ average = 0, count = 0, distribution = {} }) {
  const total = count || Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900">{average.toFixed(1)}</p>
          <RatingStars value={average} readOnly size="sm" />
          <p className="mt-1 text-xs text-gray-500">{count} review{count === 1 ? "" : "s"}</p>
        </div>

        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const c = distribution[star] || 0;
            const pct = Math.round((c / total) * 100);
            return (
              <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-3">{star}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right">{c}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
