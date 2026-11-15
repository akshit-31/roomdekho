import { CheckCircle2 } from "lucide-react";

const AMENITY_LABELS = {
  wifi: "WiFi",
  ac: "Air Conditioning",
  geyser: "Geyser",
  parking: "Parking",
  laundry: "Laundry",
  gym: "Gym",
  power_backup: "Power Backup",
  lift: "Lift",
  security: "24x7 Security",
};

export default function PropertyAmenities({ amenities = [] }) {
  if (!amenities.length) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 shadow-xl text-white">
      <h2 className="mb-3 text-sm sm:text-base font-extrabold text-white">Amenities</h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {amenities.map((a) => (
          <div key={a} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200">
            <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
            {AMENITY_LABELS[a] || a}
          </div>
        ))}
      </div>
    </div>
  );
}
