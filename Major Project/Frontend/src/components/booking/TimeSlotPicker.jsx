import clsx from "clsx";

const SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM",
];

export default function TimeSlotPicker({ selectedSlot, onSelect, unavailableSlots = [] }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">Select a time slot</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {SLOTS.map((slot) => {
          const disabled = unavailableSlots.includes(slot);
          const active = selectedSlot === slot;
          return (
            <button
              key={slot}
              disabled={disabled}
              onClick={() => onSelect(slot)}
              className={clsx(
                "rounded-xl border px-2 py-2 text-xs font-medium",
                disabled
                  ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                  : active
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}
