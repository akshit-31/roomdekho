import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

function Row({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-center justify-between border-b border-gray-50 py-2.5 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
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
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="mb-2 text-sm font-semibold text-gray-900">Property details</h2>
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
