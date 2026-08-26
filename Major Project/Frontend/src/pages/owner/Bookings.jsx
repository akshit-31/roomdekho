import { useEffect, useState } from "react";
import OwnerBookings from "../../components/owner/OwnerBookings";
import Loader from "../../components/common/Loader";
import { api } from "../../services/api/axios";

/**
 * Confirmed bookings (vs. Visits.jsx which shows all statuses).
 * Calls GET /owner/bookings directly — no wrapper in owner.api.js yet.
 */
export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/owner/bookings");
      setBookings(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Bookings</h1>
        <p className="text-sm text-gray-500">Confirmed move-ins across your listings</p>
      </div>

      {loading ? <Loader /> : <OwnerBookings visits={bookings} onUpdated={load} />}
    </div>
  );
}
