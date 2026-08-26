import { Link } from "react-router-dom";
import { useState } from "react";
import { MapPin, CalendarClock } from "lucide-react";
import placeholder from "../../assets/images/placeholder-room.jpg";
import BookingStatus from "./BookingStatus";
import Button from "../common/Button";
import ConfirmDialog from "../common/ConfirmDialog";
import RescheduleModal from "./RescheduleModal";
import { bookingApi } from "../../services/api/booking.api";
import { formatDate } from "../../utils/formatDate";

/**
 * `viewerRole` controls which actions render: owners see "Approve",
 * seekers see "Reschedule"/"Cancel" — matches server/src/modules/bookings
 * routes: PATCH /bookings/visits/:id/{approve,reschedule,cancel}.
 */
export default function VisitCard({ visit, viewerRole = "seeker", onUpdated }) {
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [loading, setLoading] = useState(false);
  const room = visit.room || {};

  const approve = async () => {
    setLoading(true);
    try {
      await bookingApi.approve(visit._id);
      onUpdated?.();
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    setLoading(true);
    try {
      await bookingApi.cancel(visit._id);
      onUpdated?.();
    } finally {
      setLoading(false);
      setShowCancel(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center">
      <Link to={`/rooms/${room._id}`} className="shrink-0">
        <img src={room.media?.[0]?.url || placeholder} alt={room.title} className="h-20 w-28 rounded-xl object-cover" />
      </Link>

      <div className="min-w-0 flex-1">
        <Link to={`/rooms/${room._id}`} className="line-clamp-1 text-sm font-semibold text-gray-900 hover:underline">
          {room.title}
        </Link>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
          <MapPin size={12} /> {room.address?.city}
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-gray-600">
          <CalendarClock size={13} />
          {formatDate(visit.scheduledDate)} · {visit.timeSlot}
        </p>
        <div className="mt-2"><BookingStatus status={visit.status} /></div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {viewerRole === "owner" && visit.status === "pending" && (
          <Button size="sm" onClick={approve} loading={loading}>Approve</Button>
        )}
        {viewerRole === "seeker" && ["pending", "confirmed"].includes(visit.status) && (
          <>
            <Button size="sm" variant="secondary" onClick={() => setShowReschedule(true)}>Reschedule</Button>
            <Button size="sm" variant="danger" onClick={() => setShowCancel(true)}>Cancel</Button>
          </>
        )}
      </div>

      <ConfirmDialog
        open={showCancel}
        title="Cancel this visit?"
        message="The owner will be notified that you can no longer make it."
        confirmLabel="Cancel visit"
        loading={loading}
        onConfirm={cancel}
        onCancel={() => setShowCancel(false)}
      />

      <RescheduleModal
        open={showReschedule}
        visit={visit}
        onClose={() => setShowReschedule(false)}
        onRescheduled={() => {
          setShowReschedule(false);
          onUpdated?.();
        }}
      />
    </div>
  );
}
