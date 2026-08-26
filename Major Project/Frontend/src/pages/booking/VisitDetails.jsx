import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, CalendarClock, ArrowLeft } from "lucide-react";
import placeholder from "../../assets/images/placeholder-room.jpg";
import BookingStatus from "../../components/booking/BookingStatus";
import PropertyOwner from "../../components/property/PropertyOwner";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import RescheduleModal from "../../components/booking/RescheduleModal";
import { bookingApi } from "../../services/api/booking.api";
import { formatDate } from "../../utils/formatDate";

export default function VisitDetails() {
  const { id } = useParams();
  const [visit, setVisit] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Booking API doesn't currently expose GET /bookings/visits/:id — we
  // fall back to filtering the "my visits" list until that endpoint exists.
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await bookingApi.myVisits();
      const found = (data.data || []).find((v) => v._id === id);
      if (!found) throw new Error("not found");
      setVisit(found);
    } catch {
      setError("This visit couldn't be found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const cancel = async () => {
    setActionLoading(true);
    try {
      await bookingApi.cancel(id);
      await load();
    } finally {
      setActionLoading(false);
      setShowCancel(false);
    }
  };

  if (loading) return <Loader label="Loading visit..." />;
  if (error || !visit) return <div className="mx-auto max-w-lg px-4 py-12"><ErrorMessage message={error} onRetry={load} /></div>;

  const room = visit.room || {};

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/visits" className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
        <ArrowLeft size={15} /> Back to my visits
      </Link>

      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex items-start gap-4">
          <img src={room.media?.[0]?.url || placeholder} alt="" className="h-20 w-28 rounded-xl object-cover" />
          <div className="flex-1">
            <Link to={`/rooms/${room._id}`} className="text-base font-semibold text-gray-900 hover:underline">{room.title}</Link>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500"><MapPin size={12} /> {room.address?.city}</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-700">
              <CalendarClock size={14} /> {formatDate(visit.scheduledDate)} · {visit.timeSlot}
            </p>
            <div className="mt-2"><BookingStatus status={visit.status} /></div>
          </div>
        </div>

        {["pending", "confirmed"].includes(visit.status) && (
          <div className="mt-5 flex gap-2 border-t border-gray-50 pt-4">
            <Button variant="secondary" onClick={() => setShowReschedule(true)}>Reschedule</Button>
            <Button variant="danger" onClick={() => setShowCancel(true)}>Cancel visit</Button>
          </div>
        )}
      </div>

      {room.owner && (
        <div className="mt-4">
          <PropertyOwner owner={room.owner} roomId={room._id} />
        </div>
      )}

      <ConfirmDialog
        open={showCancel}
        title="Cancel this visit?"
        message="The owner will be notified that you can no longer make it."
        confirmLabel="Cancel visit"
        loading={actionLoading}
        onConfirm={cancel}
        onCancel={() => setShowCancel(false)}
      />

      <RescheduleModal
        open={showReschedule}
        visit={visit}
        onClose={() => setShowReschedule(false)}
        onRescheduled={() => { setShowReschedule(false); load(); }}
      />
    </div>
  );
}
