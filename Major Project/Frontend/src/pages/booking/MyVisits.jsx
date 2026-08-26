import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarPlus, Search, MapPin } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import VisitCard from "../../components/booking/VisitCard";
import VisitCalendar from "../../components/booking/VisitCalendar";
import TimeSlotPicker from "../../components/booking/TimeSlotPicker";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { bookingApi } from "../../services/api/booking.api";
import { propertyApi } from "../../services/api/property.api";
import { searchApi } from "../../services/api/search.api";
import { useDebounce } from "../../hooks/useDebounce";
import { formatCurrency } from "../../utils/formatCurrency";

export default function MyVisits() {
  const [searchParams, setSearchParams] = useSearchParams();
  const scheduleRoomId = searchParams.get("scheduleRoomId");

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(!!scheduleRoomId);
  const [scheduleRoom, setScheduleRoom] = useState(null);
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Room picker — shown when the modal is opened without a room already chosen
  const [roomQuery, setRoomQuery] = useState("");
  const debouncedQuery = useDebounce(roomQuery, 350);
  const [roomOptions, setRoomOptions] = useState([]);
  const [searchingRooms, setSearchingRooms] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await bookingApi.myVisits();
      setVisits(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (scheduleRoomId) {
      propertyApi.getOne(scheduleRoomId).then(({ data }) => setScheduleRoom(data.data));
      setScheduleOpen(true);
    }
  }, [scheduleRoomId]);

  useEffect(() => {
    if (scheduleRoomId || !scheduleOpen) return;
    if (!debouncedQuery.trim()) { setRoomOptions([]); return; }

    setSearchingRooms(true);
    searchApi
      .searchRooms({ q: debouncedQuery, limit: 6 })
      .then(({ data }) => setRoomOptions(data.data?.items || []))
      .catch(() => setRoomOptions([]))
      .finally(() => setSearchingRooms(false));
  }, [debouncedQuery, scheduleRoomId, scheduleOpen]);

  const openScheduler = () => setScheduleOpen(true);

  const pickRoom = (room) => {
    setScheduleRoom(room);
    searchParams.set("scheduleRoomId", room._id);
    setSearchParams(searchParams, { replace: true });
  };

  const closeSchedule = () => {
    setScheduleOpen(false);
    setScheduleRoom(null);
    setDate(null);
    setSlot(null);
    setRoomQuery("");
    setRoomOptions([]);
    searchParams.delete("scheduleRoomId");
    setSearchParams(searchParams, { replace: true });
  };

  const submitSchedule = async () => {
    if (!date || !slot || !scheduleRoomId) return;
    setSubmitting(true);
    try {
      await bookingApi.scheduleVisit({
        roomId: scheduleRoomId,
        scheduledDate: date.toISOString(),
        timeSlot: slot,
      });
      closeSchedule();
      load();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="My visits"
      subtitle="Property visits you've scheduled"
      action={
        <Button variant="secondary" icon={CalendarPlus} onClick={openScheduler}>
          Schedule a visit
        </Button>
      }
    >
      {loading ? (
        <Loader />
      ) : !visits.length ? (
        <EmptyState
          title="No visits scheduled"
          description="Browse rooms and schedule a visit to see it here — or use the button above to pick one now."
        />
      ) : (
        <div className="space-y-3">
          {visits.map((v) => <VisitCard key={v._id} visit={v} viewerRole="seeker" onUpdated={load} />)}
        </div>
      )}

      <Modal
        open={scheduleOpen}
        onClose={closeSchedule}
        title={scheduleRoom ? `Schedule a visit — ${scheduleRoom.title}` : "Schedule a visit"}
        footer={
          scheduleRoomId ? (
            <>
              <Button variant="ghost" onClick={closeSchedule}>Cancel</Button>
              <Button onClick={submitSchedule} loading={submitting} disabled={!date || !slot}>Confirm visit</Button>
            </>
          ) : null
        }
      >
        {!scheduleRoomId ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Search for the room you'd like to visit.</p>
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                value={roomQuery}
                onChange={(e) => setRoomQuery(e.target.value)}
                placeholder="Search by title, locality, or landmark..."
                className="w-full rounded-xl border border-gray-300 py-2.5 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {searchingRooms && (
              <div className="flex justify-center py-4">
                <Spinner size={20} />
              </div>
            )}

            {!searchingRooms && debouncedQuery && roomOptions.length === 0 && (
              <p className="py-4 text-center text-sm text-gray-400">No rooms matched that search.</p>
            )}

            {roomOptions.length > 0 && (
              <ul className="max-h-72 space-y-1 overflow-y-auto">
                {roomOptions.map((room) => (
                  <li key={room._id}>
                    <button
                      type="button"
                      onClick={() => pickRoom(room)}
                      className="flex w-full items-center gap-3 rounded-xl border border-gray-100 p-2.5 text-left hover:border-brand-200 hover:bg-brand-50"
                    >
                      <img
                        src={room.media?.[0]?.url || "/images/default-room.jpg"}
                        alt={room.title}
                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{room.title}</p>
                        <p className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={11} /> {room.address?.locality || room.address?.city}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-brand-600">
                        {formatCurrency(room.rent)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <VisitCalendar selectedDate={date} onSelect={setDate} />
            <TimeSlotPicker selectedSlot={slot} onSelect={setSlot} />
          </div>
        )}
      </Modal>
    </PageContainer>
  );
}
