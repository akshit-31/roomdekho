import { useEffect, useState } from "react";
import OwnerBookings from "../../components/owner/OwnerBookings";
import Loader from "../../components/common/Loader";
import { api } from "../../services/api/axios";

/**
 * No owner-scoped visits endpoint in owner.api.js yet — calls
 * GET /owner/visits directly (server/src/modules/owner would aggregate
 * bookings across the owner's rooms).
 */
export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/owner/visits");
      setVisits(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Visits</h1>
        <p className="text-sm text-gray-500">Property visits scheduled across all your listings</p>
      </div>

      {loading ? <Loader /> : <OwnerBookings visits={visits} onUpdated={load} />}
    </div>
  );
}
