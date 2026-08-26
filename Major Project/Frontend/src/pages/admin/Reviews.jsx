import { useEffect, useState } from "react";
import ReviewModeration from "../../components/admin/ReviewModeration";
import Loader from "../../components/common/Loader";
import { api } from "../../services/api/axios";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/reviews", { params: { status: "flagged" } });
      setReviews(data.data || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Review moderation</h1>
        <p className="text-sm text-gray-500">Reviews flagged by users for containing abuse or false claims</p>
      </div>

      {loading ? <Loader /> : <ReviewModeration reviews={reviews} onChanged={load} />}
    </div>
  );
}
