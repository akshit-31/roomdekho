import { useEffect, useState } from "react";
import OwnerEarnings from "../../components/owner/OwnerEarnings";
import Loader from "../../components/common/Loader";
import { api } from "../../services/api/axios";

export default function Earnings() {
  const [earnings, setEarnings] = useState({ total: 0, monthly: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/owner/earnings")
      .then(({ data }) => setEarnings(data.data || { total: 0, monthly: [] }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Earnings</h1>
        <p className="text-sm text-gray-500">Revenue collected through the platform</p>
      </div>

      {loading ? <Loader /> : <OwnerEarnings earnings={earnings} />}
    </div>
  );
}
