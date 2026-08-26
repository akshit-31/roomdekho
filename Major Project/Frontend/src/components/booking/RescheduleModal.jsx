import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import VisitCalendar from "./VisitCalendar";
import TimeSlotPicker from "./TimeSlotPicker";
import { bookingApi } from "../../services/api/booking.api";

export default function RescheduleModal({ open, visit, onClose, onRescheduled }) {
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!date || !slot) return;
    setLoading(true);
    try {
      await bookingApi.reschedule(visit._id, { scheduledDate: date.toISOString(), timeSlot: slot });
      onRescheduled();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reschedule visit"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} loading={loading} disabled={!date || !slot}>Confirm new time</Button>
        </>
      }
    >
      <div className="space-y-5">
        <VisitCalendar selectedDate={date} onSelect={setDate} />
        <TimeSlotPicker selectedSlot={slot} onSelect={setSlot} />
      </div>
    </Modal>
  );
}
