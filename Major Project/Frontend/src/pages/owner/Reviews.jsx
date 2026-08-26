import { useEffect, useState } from "react";
import OwnerReviews from "../../components/owner/OwnerReviews";
import Loader from "../../components/common/Loader";
import { api } from "../../services/api/axios";

export default function Reviews() {
  const [data, setData] = useState({ reviews: [], average: 0, distribution: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/owner/reviews")
      .then(({ data: res }) => setData(res.data || { reviews: [], average: 0, distribution: {} }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500">Feedback from tenants across your listings</p>
      </div>

      {loading ? <Loader /> : <OwnerReviews {...data} />}
    </div>
  );
}
