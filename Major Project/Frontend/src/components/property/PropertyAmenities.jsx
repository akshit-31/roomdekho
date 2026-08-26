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
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">Amenities</h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {amenities.map((a) => (
          <div key={a} className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircle2 size={16} className="text-brand-500" />
            {AMENITY_LABELS[a] || a}
          </div>
        ))}
      </div>
    </div>
  );
}
