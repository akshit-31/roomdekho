import { useEffect, useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import ReviewCard from "../../components/reviews/ReviewCard";
import RatingSummary from "../../components/reviews/RatingSummary";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import { api } from "../../services/api/axios";

const TABS = [
  { id: "received", label: "Reviews about me" },
  { id: "written", label: "Reviews I've written" },
];

/**
 * Personal reviews hub. review.api.js only exposes create/listForTarget/
 * report (target-scoped) — there's no "my reviews" endpoint yet, so this
 * calls GET /reviews/mine?type=received|written directly. Swap to a
 * dedicated reviewApi.mine() wrapper once that route exists.
 */
export default function Reviews() {
  const [tab, setTab] = useState("received");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async (type = tab) => {
    setLoading(true);
    try {
      const { data } = await api.get("/reviews/mine", { params: { type } });
      setReviews(data.data || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(tab); }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <PageContainer title="Reviews" subtitle="Feedback from rooms, owners, and roommates you've interacted with">
      <div className="mb-5 flex gap-1 rounded-xl bg-gray-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : !reviews.length ? (
        <EmptyState
          title={tab === "received" ? "No reviews yet" : "You haven't written any reviews"}
          description={
            tab === "received"
              ? "Reviews from people you've shared a room with will appear here."
              : "Reviews you leave for rooms, owners, or roommates will appear here."
          }
        />
      ) : (
        <div className="space-y-4">
          {tab === "received" && <RatingSummary average={average} count={reviews.length} />}
          <div className="space-y-3">
            {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
