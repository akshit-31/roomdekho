import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function Row({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-2.5 last:border-0">
      <span className="text-xs sm:text-sm text-slate-300">{label}</span>
      <span className="text-xs sm:text-sm font-bold text-white">{value}</span>
    </div>
  );
}

const LABELS = {
  room: "Independent Room",
  pg: "PG",
  flat: "Flat",
  hostel: "Hostel",
  single: "Single sharing",
  double: "Double sharing",
  triple: "Triple sharing",
  dormitory: "Dormitory",
  unfurnished: "Unfurnished",
  semi_furnished: "Semi-furnished",
  fully_furnished: "Fully furnished",
};

export default function PropertyInfo({ room }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 shadow-xl text-white">
      <h2 className="mb-3 text-sm sm:text-base font-extrabold text-white">Property details</h2>
      <Row label="Type" value={LABELS[room.propertyType] || room.propertyType} />
      <Row label="Sharing" value={LABELS[room.sharingType] || room.sharingType} />
      <Row label="Monthly rent" value={formatCurrency(room.rent)} />
      <Row label="Security deposit" value={formatCurrency(room.securityDeposit)} />
      <Row label="Furnishing" value={LABELS[room.furnishing] || room.furnishing} />
      <Row
        label="Occupancy"
        value={room.occupancy ? `${room.occupancy.availableBeds}/${room.occupancy.totalBeds} beds available` : undefined}
      />
      <Row label="Move-in date" value={room.moveInDate ? formatDate(room.moveInDate) : undefined} />
      <Row
        label="Preferred gender"
        value={room.occupancy?.genderPreference && room.occupancy.genderPreference !== "any" ? room.occupancy.genderPreference : "Any"}
      />
    </div>
  );
}
