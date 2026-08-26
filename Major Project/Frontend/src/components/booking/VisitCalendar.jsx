import { useMemo } from "react";
import clsx from "clsx";

function nextNDays(n) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

/**
 * Simple horizontal date strip for the next 14 days (owners can extend
 * this to read real unavailable dates from the room/booking data later).
 */
export default function VisitCalendar({ selectedDate, onSelect, daysAhead = 14 }) {
  const days = useMemo(() => nextNDays(daysAhead), [daysAhead]);

  const isSameDay = (a, b) => a.toDateString() === b.toDateString();

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-700">Select a date</p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((day) => {
          const active = selectedDate && isSameDay(day, selectedDate);
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelect(day)}
              className={clsx(
                "flex min-w-[56px] flex-col items-center rounded-xl border px-2.5 py-2 text-sm",
                active ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"
              )}
            >
              <span className="text-[11px] uppercase text-gray-400">
                {day.toLocaleDateString(undefined, { weekday: "short" })}
              </span>
              <span className="font-semibold">{day.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
